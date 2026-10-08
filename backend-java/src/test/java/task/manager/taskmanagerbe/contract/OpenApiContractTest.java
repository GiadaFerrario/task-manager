package task.manager.taskmanagerbe.contract;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.transaction.annotation.Transactional;
import task.manager.taskmanagerbe.AbstractIntegrationTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.request;

/**
 * Runs a scenario through the whole API and checks every response against api/openapi.yaml:
 * the same scenario is run by the C# backend, so both implement the same contract.
 */
@Transactional
class OpenApiContractTest extends AbstractIntegrationTest {

    private static final long UNKNOWN_ID = 999_999;

    @Autowired
    private MockMvc mockMvc;

    private OpenApiContract contract;

    @BeforeEach
    void loadContract() throws Exception {
        contract = OpenApiContract.load();
    }

    @Test
    void everyDocumentedResponseIsServedAsDocumented() throws Exception {
        // categories
        call(HttpMethod.GET, "/categories", "/categories", null, 200);
        long categoryId = idOf(call(HttpMethod.POST, "/categories", "/categories",
                "{\"name\":\"Work\",\"description\":\"Office\",\"color\":\"#1976d2\"}", 201));
        call(HttpMethod.POST, "/categories", "/categories", "{\"name\":\" \",\"color\":\"#fff\"}", 400);
        call(HttpMethod.PUT, "/categories/" + categoryId, "/categories/{id}",
                "{\"name\":\"Office\",\"color\":\"#e53935\"}", 200);
        call(HttpMethod.PUT, "/categories/" + categoryId, "/categories/{id}", "{\"name\":\"\"}", 400);
        call(HttpMethod.PUT, "/categories/" + UNKNOWN_ID, "/categories/{id}", "{\"name\":\"X\"}", 404);

        // tasks
        call(HttpMethod.GET, "/tasks", "/tasks", null, 200);
        long taskId = idOf(call(HttpMethod.POST, "/tasks", "/tasks",
                "{\"title\":\"Write report\",\"priority\":\"HIGH\",\"categoryId\":" + categoryId + "}", 201));
        call(HttpMethod.POST, "/tasks", "/tasks", "{\"title\":\" \"}", 400);
        call(HttpMethod.POST, "/tasks", "/tasks", "{\"title\":\"T\",\"categoryId\":" + UNKNOWN_ID + "}", 404);
        call(HttpMethod.GET, "/tasks/" + taskId, "/tasks/{id}", null, 200);
        call(HttpMethod.GET, "/tasks/" + UNKNOWN_ID, "/tasks/{id}", null, 404);
        call(HttpMethod.PUT, "/tasks/" + taskId, "/tasks/{id}",
                "{\"title\":\"Write report\",\"description\":\"edited\",\"status\":\"DONE\"}", 200);
        call(HttpMethod.PUT, "/tasks/" + taskId, "/tasks/{id}", "{\"title\":\" \",\"status\":\"TODO\"}", 400);
        call(HttpMethod.PUT, "/tasks/" + UNKNOWN_ID, "/tasks/{id}", "{\"title\":\"T\",\"status\":\"TODO\"}", 404);

        // single-field changes
        call(HttpMethod.PATCH, "/tasks/" + taskId + "/status?status=IN_PROGRESS", "/tasks/{id}/status", null, 200);
        call(HttpMethod.PATCH, "/tasks/" + taskId + "/status?status=bogus", "/tasks/{id}/status", null, 400);
        call(HttpMethod.PATCH, "/tasks/" + UNKNOWN_ID + "/status?status=DONE", "/tasks/{id}/status", null, 404);
        call(HttpMethod.PATCH, "/tasks/" + taskId + "/priority?priority=LOW", "/tasks/{id}/priority", null, 200);
        call(HttpMethod.PATCH, "/tasks/" + taskId + "/priority?priority=bogus", "/tasks/{id}/priority", null, 400);
        call(HttpMethod.PATCH, "/tasks/" + UNKNOWN_ID + "/priority?priority=LOW", "/tasks/{id}/priority", null, 404);
        call(HttpMethod.PATCH, "/tasks/" + taskId + "/category?categoryId=" + categoryId, "/tasks/{id}/category", null, 200);
        call(HttpMethod.PATCH, "/tasks/" + UNKNOWN_ID + "/category?categoryId=" + categoryId, "/tasks/{id}/category", null, 404);

        // enums
        call(HttpMethod.GET, "/statuses", "/statuses", null, 200);
        call(HttpMethod.GET, "/priorities", "/priorities", null, 200);

        // deletions
        call(HttpMethod.DELETE, "/tasks/" + taskId, "/tasks/{id}", null, 204);
        call(HttpMethod.DELETE, "/tasks/" + taskId, "/tasks/{id}", null, 404);
        call(HttpMethod.DELETE, "/categories/" + categoryId, "/categories/{id}", null, 204);
        call(HttpMethod.DELETE, "/categories/" + categoryId, "/categories/{id}", null, 404);

        // nothing documented in the contract was left untested
        assertThat(contract.exercisedResponses())
                .as("documented responses that this scenario never exercises")
                .containsExactlyInAnyOrderElementsOf(contract.documentedResponses());
    }

    /** Performs the request, checks the status and validates the response against the contract. */
    private String call(HttpMethod method, String url, String pathTemplate, String json, int expectedStatus) throws Exception {
        MockHttpServletRequestBuilder request = request(method, "/api" + url);
        if (json != null) {
            request.contentType(MediaType.APPLICATION_JSON).content(json);
        }
        MvcResult result = mockMvc.perform(request).andReturn();
        String body = result.getResponse().getContentAsString();

        assertThat(result.getResponse().getStatus())
                .as("%s %s, body = %s", method, url, body)
                .isEqualTo(expectedStatus);
        contract.assertResponse(method.name(), pathTemplate, expectedStatus, body);
        return body;
    }

    private static long idOf(String body) {
        return ((Number) JsonPath.read(body, "$.id")).longValue();
    }
}
