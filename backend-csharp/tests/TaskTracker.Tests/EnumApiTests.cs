namespace TaskTracker.Tests;

public class EnumApiTests(ApiFactory factory) : ApiTestBase(factory)
{
    [Fact]
    public async Task Statuses_AreExposedAsUpperSnakeCaseNamesWithLabels()
    {
        var statuses = await Json(await Client.GetAsync("/api/statuses"));

        Assert.Equal(["TODO", "IN_PROGRESS", "DONE"], statuses.EnumerateArray().Select(s => s.GetProperty("name").GetString()));
        Assert.Equal("To do", statuses[0].GetProperty("label").GetString());
        Assert.Equal("In progress", statuses[1].GetProperty("label").GetString());
    }

    [Fact]
    public async Task Priorities_AreExposedAsUpperSnakeCaseNamesWithLabels()
    {
        var priorities = await Json(await Client.GetAsync("/api/priorities"));

        Assert.Equal(["LOW", "MEDIUM", "HIGH"], priorities.EnumerateArray().Select(p => p.GetProperty("name").GetString()));
        Assert.Equal("High", priorities[2].GetProperty("label").GetString());
    }
}
