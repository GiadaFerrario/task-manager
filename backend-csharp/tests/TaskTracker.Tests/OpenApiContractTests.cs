using System.Text;
using System.Text.Json;

namespace TaskTracker.Tests;

/// <summary>
/// Runs a scenario through the whole API and checks every response against api/openapi.yaml:
/// the same scenario is run by the Java backend, so both implement the same contract.
/// </summary>
public class OpenApiContractTests(ApiFactory factory) : ApiTestBase(factory)
{
    private const long UnknownId = 999_999;

    private readonly OpenApiContract _contract = OpenApiContract.Load();

    [Fact]
    public async Task EveryDocumentedResponseIsServedAsDocumented()
    {
        // categories
        await Call(HttpMethod.Get, "/categories", "/categories", null, 200);
        var categoryId = IdOf(await Call(HttpMethod.Post, "/categories", "/categories",
            """{"name":"Work","description":"Office","color":"#1976d2"}""", 201));
        await Call(HttpMethod.Post, "/categories", "/categories", """{"name":" ","color":"#fff"}""", 400);
        await Call(HttpMethod.Put, $"/categories/{categoryId}", "/categories/{id}",
            """{"name":"Office","color":"#e53935"}""", 200);
        await Call(HttpMethod.Put, $"/categories/{categoryId}", "/categories/{id}", """{"name":""}""", 400);
        await Call(HttpMethod.Put, $"/categories/{UnknownId}", "/categories/{id}", """{"name":"X"}""", 404);

        // tasks
        await Call(HttpMethod.Get, "/tasks", "/tasks", null, 200);
        var taskId = IdOf(await Call(HttpMethod.Post, "/tasks", "/tasks",
            $$"""{"title":"Write report","priority":"HIGH","categoryId":{{categoryId}}}""", 201));
        await Call(HttpMethod.Post, "/tasks", "/tasks", """{"title":" "}""", 400);
        await Call(HttpMethod.Post, "/tasks", "/tasks", $$"""{"title":"T","categoryId":{{UnknownId}}}""", 404);
        await Call(HttpMethod.Get, $"/tasks/{taskId}", "/tasks/{id}", null, 200);
        await Call(HttpMethod.Get, $"/tasks/{UnknownId}", "/tasks/{id}", null, 404);
        await Call(HttpMethod.Put, $"/tasks/{taskId}", "/tasks/{id}",
            """{"title":"Write report","description":"edited","status":"DONE"}""", 200);
        await Call(HttpMethod.Put, $"/tasks/{taskId}", "/tasks/{id}", """{"title":" ","status":"TODO"}""", 400);
        await Call(HttpMethod.Put, $"/tasks/{UnknownId}", "/tasks/{id}", """{"title":"T","status":"TODO"}""", 404);

        // single-field changes
        await Call(HttpMethod.Patch, $"/tasks/{taskId}/status?status=IN_PROGRESS", "/tasks/{id}/status", null, 200);
        await Call(HttpMethod.Patch, $"/tasks/{taskId}/status?status=bogus", "/tasks/{id}/status", null, 400);
        await Call(HttpMethod.Patch, $"/tasks/{UnknownId}/status?status=DONE", "/tasks/{id}/status", null, 404);
        await Call(HttpMethod.Patch, $"/tasks/{taskId}/priority?priority=LOW", "/tasks/{id}/priority", null, 200);
        await Call(HttpMethod.Patch, $"/tasks/{taskId}/priority?priority=bogus", "/tasks/{id}/priority", null, 400);
        await Call(HttpMethod.Patch, $"/tasks/{UnknownId}/priority?priority=LOW", "/tasks/{id}/priority", null, 404);
        await Call(HttpMethod.Patch, $"/tasks/{taskId}/category?categoryId={categoryId}", "/tasks/{id}/category", null, 200);
        await Call(HttpMethod.Patch, $"/tasks/{UnknownId}/category?categoryId={categoryId}", "/tasks/{id}/category", null, 404);

        // enums
        await Call(HttpMethod.Get, "/statuses", "/statuses", null, 200);
        await Call(HttpMethod.Get, "/priorities", "/priorities", null, 200);

        // deletions
        await Call(HttpMethod.Delete, $"/tasks/{taskId}", "/tasks/{id}", null, 204);
        await Call(HttpMethod.Delete, $"/tasks/{taskId}", "/tasks/{id}", null, 404);
        await Call(HttpMethod.Delete, $"/categories/{categoryId}", "/categories/{id}", null, 204);
        await Call(HttpMethod.Delete, $"/categories/{categoryId}", "/categories/{id}", null, 404);

        // nothing documented in the contract was left untested
        Assert.Equal(_contract.DocumentedResponses(), _contract.ExercisedResponses);
    }

    /// <summary>Performs the request, checks the status and validates the response against the contract.</summary>
    private async Task<string> Call(HttpMethod method, string url, string pathTemplate, string? json, int expectedStatus)
    {
        var request = new HttpRequestMessage(method, "/api" + url);
        if (json is not null) request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await Client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();

        Assert.True((int)response.StatusCode == expectedStatus, $"{method} {url}: expected {expectedStatus} but got {(int)response.StatusCode}, body = {body}");
        _contract.AssertResponse(method.Method, pathTemplate, expectedStatus, body);
        return body;
    }

    private static long IdOf(string body) => JsonDocument.Parse(body).RootElement.GetProperty("id").GetInt64();
}
