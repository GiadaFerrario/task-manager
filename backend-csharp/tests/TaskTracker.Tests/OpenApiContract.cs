using System.Text.Json;
using System.Text.Json.Nodes;
using Json.Schema;
using YamlDotNet.Core;
using YamlDotNet.RepresentationModel;

namespace TaskTracker.Tests;

/// <summary>
/// The shared API contract (api/openapi.yaml at the repository root).
/// Every response of the running application is checked against it: the status code must be documented
/// and the body must match the schema. The contract test of the Java backend does exactly the same.
/// </summary>
public sealed class OpenApiContract
{
    private static readonly string[] Methods = ["get", "put", "post", "delete", "patch"];

    private readonly JsonObject _spec;
    private readonly SortedSet<string> _exercised = [];

    private OpenApiContract(JsonObject spec) => _spec = spec;

    public IReadOnlyCollection<string> ExercisedResponses => _exercised;

    public static OpenApiContract Load()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir is not null && !File.Exists(Path.Combine(dir.FullName, "api", "openapi.yaml")))
            dir = dir.Parent;
        if (dir is null)
            throw new InvalidOperationException($"api/openapi.yaml not found in any parent of {AppContext.BaseDirectory}");

        var yaml = new YamlStream();
        using var reader = new StreamReader(Path.Combine(dir.FullName, "api", "openapi.yaml"));
        yaml.Load(reader);
        return new OpenApiContract((JsonObject)ToJson(yaml.Documents[0].RootNode)!);
    }

    /// <summary>Checks the status code and the body of a response, and remembers that "METHOD path status" was exercised.</summary>
    public void AssertResponse(string method, string path, int status, string body)
    {
        var key = $"{method.ToUpperInvariant()} {path} {status}";
        var operation = _spec["paths"]?[path]?[method.ToLowerInvariant()]
            ?? throw new Xunit.Sdk.XunitException($"{method} {path} is not documented in openapi.yaml");
        var response = Resolve(operation["responses"]?[status.ToString()])
            ?? throw new Xunit.Sdk.XunitException($"status {status} of {method} {path} is not documented in openapi.yaml");

        var schema = response["content"]?["application/json"]?["schema"];
        if (schema is null)
        {
            Assert.True(body.Length == 0, $"{key} must have no body, but it has: {body}");
        }
        else
        {
            Assert.True(body.Length > 0, $"{key} must have a JSON body");
            var result = SchemaOf(schema).Evaluate(JsonNode.Parse(body), new EvaluationOptions { OutputFormat = OutputFormat.List });
            Assert.True(result.IsValid, $"{key}: the body does not match the schema, body = {body}, errors = {Errors(result)}");
        }

        _exercised.Add(key);
    }

    /// <summary>Every "METHOD path status" documented in the contract.</summary>
    public SortedSet<string> DocumentedResponses()
    {
        var documented = new SortedSet<string>();
        foreach (var (path, pathItem) in _spec["paths"]!.AsObject())
            foreach (var (name, operation) in pathItem!.AsObject())
            {
                if (!Methods.Contains(name)) continue; // e.g. the shared "parameters"
                foreach (var (status, _) in operation!["responses"]!.AsObject())
                    documented.Add($"{name.ToUpperInvariant()} {path} {status}");
            }
        return documented;
    }

    private JsonNode? Resolve(JsonNode? node)
    {
        if (node?["$ref"] is not { } reference) return node;
        JsonNode? current = _spec;
        foreach (var part in reference.GetValue<string>().TrimStart('#', '/').Split('/'))
            current = current?[part];
        return current;
    }

    /// <summary>Builds a standalone JSON Schema: the schema itself plus the components, reachable as #/$defs.</summary>
    private JsonSchema SchemaOf(JsonNode schema)
    {
        var root = (JsonObject)schema.DeepClone();
        root["$defs"] = _spec["components"]!["schemas"]!.DeepClone();
        return JsonSchema.FromText(root.ToJsonString().Replace("#/components/schemas/", "#/$defs/"));
    }

    private static string Errors(EvaluationResults result) =>
        string.Join("; ", result.Details.Where(d => d.Errors is not null)
            .SelectMany(d => d.Errors!.Select(e => $"{d.InstanceLocation}: {e.Value}")));

    // YAML scalars carry no type: plain scalars are numbers, booleans or null when they look like it
    private static JsonNode? ToJson(YamlNode node) => node switch
    {
        YamlMappingNode mapping => new JsonObject(mapping.Children.Select(c =>
            new KeyValuePair<string, JsonNode?>(((YamlScalarNode)c.Key).Value!, ToJson(c.Value)))),
        YamlSequenceNode sequence => new JsonArray(sequence.Children.Select(ToJson).ToArray()),
        YamlScalarNode { Style: ScalarStyle.Plain } scalar => scalar.Value switch
        {
            null or "" or "null" or "~" => null,
            "true" => JsonValue.Create(true),
            "false" => JsonValue.Create(false),
            var text when long.TryParse(text, out var number) => JsonValue.Create(number),
            var text when double.TryParse(text, System.Globalization.CultureInfo.InvariantCulture, out var number) => JsonValue.Create(number),
            var text => JsonValue.Create(text),
        },
        YamlScalarNode scalar => JsonValue.Create(scalar.Value),
        _ => throw new NotSupportedException(node.GetType().Name),
    };
}
