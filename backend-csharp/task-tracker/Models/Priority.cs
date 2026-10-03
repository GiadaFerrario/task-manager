namespace task_tracker.Models;

public enum Priority { Low, Medium, High }

public static class PriorityExtensions
{
    public static string Label(this Priority priority) => priority switch
    {
        Priority.Low => "Low",
        Priority.Medium => "Medium",
        Priority.High => "High",
        _ => priority.ToString()
    };
}