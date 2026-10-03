namespace task_tracker.Models;

public class TaskItem
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public Priority? Priority { get; set; }
    public Status Status { get; set; } = Status.Todo;

    public int? CategoryId { get; set; }
    public Category? Category { get; set; }
}