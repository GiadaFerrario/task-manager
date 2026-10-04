using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

namespace TaskTracker.Tests;

/// <summary>Shared helpers: an HTTP client on the app, and an empty database before every test.</summary>
[Collection(ApiCollection.Name)]
public abstract class ApiTestBase(ApiFactory factory) : IAsyncLifetime
{
    protected readonly HttpClient Client = factory.CreateClient();

    public Task InitializeAsync() => factory.ResetDatabaseAsync();

    public Task DisposeAsync() => Task.CompletedTask;

    protected Task<HttpResponseMessage> PostJson(string url, string json) =>
        Client.PostAsync(url, new StringContent(json, Encoding.UTF8, "application/json"));

    protected Task<HttpResponseMessage> PutJson(string url, string json) =>
        Client.PutAsync(url, new StringContent(json, Encoding.UTF8, "application/json"));

    protected static async Task<JsonElement> Json(HttpResponseMessage response) =>
        await response.Content.ReadFromJsonAsync<JsonElement>();

    protected async Task<int> CreateCategory(string name, string color)
    {
        var response = await PostJson("/api/categories", $$"""{"name":"{{name}}","color":"{{color}}"}""");
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        return (await Json(response)).GetProperty("id").GetInt32();
    }

    protected async Task<int> CreateTask(string json)
    {
        var response = await PostJson("/api/tasks", json);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        return (await Json(response)).GetProperty("id").GetInt32();
    }
}
