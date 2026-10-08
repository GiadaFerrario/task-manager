package task.manager.taskmanagerbe.contract;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.networknt.schema.JsonSchema;
import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.SpecVersion;
import com.networknt.schema.ValidationMessage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

/**
 * The shared API contract (api/openapi.yaml at the repository root).
 * <p>
 * Every response of the running application is checked against it: the status code must be documented
 * and the body must match the schema. The contract tests of the C# backend do exactly the same.
 */
final class OpenApiContract {

    private static final ObjectMapper JSON = new ObjectMapper();
    private static final JsonSchemaFactory SCHEMAS = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V202012);
    private static final Set<String> METHODS = Set.of("get", "put", "post", "delete", "patch");

    private final JsonNode spec;
    private final Set<String> exercised = new TreeSet<>();

    private OpenApiContract(JsonNode spec) {
        this.spec = spec;
    }

    static OpenApiContract load() throws IOException {
        Path dir = Path.of("").toAbsolutePath();
        while (dir != null && !Files.exists(dir.resolve("api/openapi.yaml"))) {
            dir = dir.getParent();
        }
        if (dir == null) {
            throw new IllegalStateException("api/openapi.yaml not found in any parent of " + Path.of("").toAbsolutePath());
        }
        return new OpenApiContract(new ObjectMapper(new YAMLFactory()).readTree(dir.resolve("api/openapi.yaml").toFile()));
    }

    /** Checks the status code and the body of a response, and remembers that "METHOD path status" was exercised. */
    void assertResponse(String method, String path, int status, String body) throws IOException {
        String key = method.toUpperCase() + " " + path + " " + status;
        JsonNode operation = spec.path("paths").path(path).path(method.toLowerCase());
        assertThat(operation.isMissingNode()).as("%s is not documented in openapi.yaml", method + " " + path).isFalse();

        JsonNode response = resolve(operation.path("responses").path(String.valueOf(status)));
        assertThat(response.isMissingNode()).as("status %s of %s is not documented in openapi.yaml", status, method + " " + path).isFalse();

        JsonNode schema = response.path("content").path("application/json").path("schema");
        if (schema.isMissingNode()) {
            assertThat(body).as("%s must have no body", key).isEmpty();
        } else {
            assertThat(body).as("%s must have a JSON body", key).isNotBlank();
            Set<ValidationMessage> errors = schemaOf(schema).validate(JSON.readTree(body));
            assertThat(errors).as("%s: the body does not match the schema, body = %s", key, body).isEmpty();
        }
        exercised.add(key);
    }

    /** Every "METHOD path status" documented in the contract. */
    Set<String> documentedResponses() {
        Set<String> documented = new TreeSet<>();
        Iterator<Map.Entry<String, JsonNode>> paths = spec.path("paths").fields();
        while (paths.hasNext()) {
            Map.Entry<String, JsonNode> path = paths.next();
            Iterator<Map.Entry<String, JsonNode>> operations = path.getValue().fields();
            while (operations.hasNext()) {
                Map.Entry<String, JsonNode> operation = operations.next();
                if (!METHODS.contains(operation.getKey())) {
                    continue; // e.g. the shared "parameters"
                }
                operation.getValue().path("responses").fieldNames().forEachRemaining(status ->
                        documented.add(operation.getKey().toUpperCase() + " " + path.getKey() + " " + status));
            }
        }
        return documented;
    }

    Set<String> exercisedResponses() {
        return exercised;
    }

    private JsonNode resolve(JsonNode node) {
        if (node.has("$ref")) {
            return spec.at(node.get("$ref").asText().substring(1));
        }
        return node;
    }

    /** Builds a standalone JSON Schema: the schema itself plus the components, reachable as #/$defs. */
    private JsonSchema schemaOf(JsonNode schema) throws IOException {
        ObjectNode root = schema.deepCopy();
        root.set("$defs", spec.path("components").path("schemas").deepCopy());
        String text = JSON.writeValueAsString(root).replace("#/components/schemas/", "#/$defs/");
        return SCHEMAS.getSchema(JSON.readTree(text));
    }
}
