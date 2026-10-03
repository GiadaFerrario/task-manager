namespace task_tracker.Dtos;

using task_tracker.Models;

public record TaskDto(
    int Id,
    string Title,
    string? Description,
    Priority? Priority,
    Status Status,
    int? CategoryId,
    string? CategoryName);

public record CreateTaskDto(string Title, string? Description, Priority? Priority, int? CategoryId);

public record UpdateTaskDto(string Title, string? Description, Priority? Priority, Status Status, int? CategoryId);