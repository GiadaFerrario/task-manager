namespace task_tracker.Models;

public enum Status { Todo, InProgress, Done }

public static class StatusExtensions
{
    public static string Label(this Status status) => status switch
    {
        Status.Todo => "To do",
        Status.InProgress => "In progress",
        Status.Done => "Done",
        _ => status.ToString()
    };
}