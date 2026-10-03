namespace task_tracker.Models;

public class Category
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required string Color { get; set; }

    public List<TaskItem> Tasks { get; set; } = [];
}