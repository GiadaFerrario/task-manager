using System.Net;
using System.Text.Json;

namespace TaskTracker.Tests;

public class TaskApiTests(ApiFactory factory) : ApiTestBase(factory)
{
    [Fact]
    public async Task Create_WithCategory_ReturnsCategoryDetailsAndDefaultsToTodo()
    {
        var categoryId = await CreateCategory("Work", "#1976d2");

        var response = await PostJson("/api/tasks",
            $$"""{"title":"Write report","description":"Draft","priority":"HIGH","categoryId":{{categoryId}}}""");

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var task = await Json(response);
        Assert.Equal("Write report", task.GetProperty("title").GetString());
        Assert.Equal("HIGH", task.GetProperty("priority").GetString());
        Assert.Equal("TODO", task.GetProperty("status").GetString());
        Assert.Equal(categoryId, task.GetProperty("categoryId").GetInt32());
        Assert.Equal("Work", task.GetProperty("categoryName").GetString());
        Assert.Equal("#1976d2", task.GetProperty("categoryColor").GetString());
    }

    [Fact]
    public async Task Create_WithoutPriorityAndCategory_IsAllowed()
    {
        var response = await PostJson("/api/tasks", """{"title":"Buy groceries"}""");

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var task = await Json(response);
        Assert.Equal(JsonValueKind.Null, task.GetProperty("priority").ValueKind);
        Assert.Equal(JsonValueKind.Null, task.GetProperty("categoryId").ValueKind);
    }

    [Fact]
    public async Task GetAll_ReturnsCreatedTasks()
    {
        await CreateTask("""{"title":"First"}""");
        await CreateTask("""{"title":"Second"}""");

        var tasks = await Json(await Client.GetAsync("/api/tasks"));

        Assert.Equal(2, tasks.GetArrayLength());
    }

    [Fact]
    public async Task Update_ReplacesFieldsAndClearsPriorityAndCategory()
    {
        var categoryId = await CreateCategory("Work", "#1976d2");
        var id = await CreateTask($$"""{"title":"T","priority":"HIGH","categoryId":{{categoryId}}}""");

        var response = await PutJson($"/api/tasks/{id}", """{"title":"T","description":"edited","status":"DONE"}""");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var task = await Json(response);
        Assert.Equal("edited", task.GetProperty("description").GetString());
        Assert.Equal("DONE", task.GetProperty("status").GetString());
        Assert.Equal(JsonValueKind.Null, task.GetProperty("priority").ValueKind);
        Assert.Equal(JsonValueKind.Null, task.GetProperty("categoryId").ValueKind);
        Assert.Equal(JsonValueKind.Null, task.GetProperty("categoryColor").ValueKind);
    }

    [Fact]
    public async Task Patch_ChangesStatusPriorityAndCategory()
    {
        var categoryId = await CreateCategory("Home", "#43a047");
        var id = await CreateTask("""{"title":"T"}""");

        var status = await Client.PatchAsync($"/api/tasks/{id}/status?status=IN_PROGRESS", null);
        var priority = await Client.PatchAsync($"/api/tasks/{id}/priority?priority=LOW", null);
        var category = await Client.PatchAsync($"/api/tasks/{id}/category?categoryId={categoryId}", null);

        Assert.Equal("IN_PROGRESS", (await Json(status)).GetProperty("status").GetString());
        Assert.Equal("LOW", (await Json(priority)).GetProperty("priority").GetString());
        Assert.Equal("Home", (await Json(category)).GetProperty("categoryName").GetString());
    }

    [Fact]
    public async Task Delete_RemovesTheTask()
    {
        var id = await CreateTask("""{"title":"T"}""");

        var deleted = await Client.DeleteAsync($"/api/tasks/{id}");
        var fetched = await Client.GetAsync($"/api/tasks/{id}");

        Assert.Equal(HttpStatusCode.NoContent, deleted.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, fetched.StatusCode);
    }

    [Fact]
    public async Task UnknownTask_Returns404()
    {
        var response = await Client.GetAsync("/api/tasks/999999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Create_WithUnknownCategory_Returns404WithErrorBody()
    {
        var response = await PostJson("/api/tasks", """{"title":"T","categoryId":999999}""");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var error = await Json(response);
        Assert.Equal(404, error.GetProperty("status").GetInt32());
        Assert.Equal("/api/tasks", error.GetProperty("path").GetString());
    }

    [Fact]
    public async Task Create_WithBlankTitle_Returns400WithErrorBody()
    {
        var response = await PostJson("/api/tasks", """{"title":"  "}""");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var error = await Json(response);
        Assert.Equal(400, error.GetProperty("status").GetInt32());
        Assert.False(string.IsNullOrWhiteSpace(error.GetProperty("message").GetString()));
    }

    [Fact]
    public async Task Update_WithUnknownCategory_Returns404()
    {
        var id = await CreateTask("""{"title":"T"}""");

        var response = await PutJson($"/api/tasks/{id}", """{"title":"T","status":"TODO","categoryId":999999}""");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task InvalidEnumValues_Return400()
    {
        var id = await CreateTask("""{"title":"T"}""");

        var patch = await Client.PatchAsync($"/api/tasks/{id}/status?status=bogus", null);
        var body = await PostJson("/api/tasks", """{"title":"T","priority":"BOGUS"}""");

        Assert.Equal(HttpStatusCode.BadRequest, patch.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, body.StatusCode);
    }
}
