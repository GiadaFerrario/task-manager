using task_tracker.Models;

namespace TaskTracker.Tests;

public class WireEnumTests
{
    [Theory]
    [InlineData(Status.Todo, "TODO")]
    [InlineData(Status.InProgress, "IN_PROGRESS")]
    [InlineData(Status.Done, "DONE")]
    public void ToWire_ConvertsPascalCaseToUpperSnakeCase(Status status, string expected) =>
        Assert.Equal(expected, WireEnum.ToWire(status));

    [Theory]
    [InlineData("IN_PROGRESS", Status.InProgress)]
    [InlineData("in_progress", Status.InProgress)]
    [InlineData("TODO", Status.Todo)]
    public void TryParse_AcceptsTheWireFormat(string wire, Status expected)
    {
        Assert.True(WireEnum.TryParse<Status>(wire, out var status));
        Assert.Equal(expected, status);
    }

    [Theory]
    [InlineData("bogus")]
    [InlineData("InProgress")]
    [InlineData("")]
    [InlineData(null)]
    public void TryParse_RejectsAnythingElse(string? wire) =>
        Assert.False(WireEnum.TryParse<Status>(wire, out _));
}
