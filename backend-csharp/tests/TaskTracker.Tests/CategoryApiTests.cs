using System.Net;

namespace TaskTracker.Tests;

public class CategoryApiTests(ApiFactory factory) : ApiTestBase(factory)
{
    [Fact]
    public async Task Create_ReturnsTheCategory()
    {
        var response = await PostJson("/api/categories", """{"name":"Work","description":"Office","color":"#1976d2"}""");

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var category = await Json(response);
        Assert.Equal("Work", category.GetProperty("name").GetString());
        Assert.Equal("#1976d2", category.GetProperty("color").GetString());
    }

    [Fact]
    public async Task Create_WithoutColor_UsesTheDefaultColor()
    {
        var response = await PostJson("/api/categories", """{"name":"Work"}""");

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.Equal("#9e9e9e", (await Json(response)).GetProperty("color").GetString());
    }

    [Fact]
    public async Task Create_WithBlankName_Returns400()
    {
        var response = await PostJson("/api/categories", """{"name":" ","color":"#fff"}""");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetAll_ReturnsCreatedCategories()
    {
        await CreateCategory("Work", "#1976d2");
        await CreateCategory("Home", "#43a047");

        var categories = await Json(await Client.GetAsync("/api/categories"));

        Assert.Equal(2, categories.GetArrayLength());
    }

    [Fact]
    public async Task Update_ChangesTheFields()
    {
        var id = await CreateCategory("Work", "#1976d2");

        var response = await PutJson($"/api/categories/{id}", """{"name":"Office","description":"d","color":"#e53935"}""");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var category = await Json(response);
        Assert.Equal("Office", category.GetProperty("name").GetString());
        Assert.Equal("#e53935", category.GetProperty("color").GetString());
    }

    [Fact]
    public async Task Delete_KeepsItsTasksWithoutCategory()
    {
        var categoryId = await CreateCategory("Work", "#1976d2");
        var taskId = await CreateTask($$"""{"title":"T","categoryId":{{categoryId}}}""");

        var deleted = await Client.DeleteAsync($"/api/categories/{categoryId}");
        var task = await Json(await Client.GetAsync($"/api/tasks/{taskId}"));

        Assert.Equal(HttpStatusCode.NoContent, deleted.StatusCode);
        Assert.Equal(System.Text.Json.JsonValueKind.Null, task.GetProperty("categoryId").ValueKind);
    }

    [Fact]
    public async Task Delete_UnknownCategory_Returns404()
    {
        var response = await Client.DeleteAsync("/api/categories/999999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
