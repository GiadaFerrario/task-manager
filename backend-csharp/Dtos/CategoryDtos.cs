namespace task_tracker.Dtos;

public record CategoryDto(int Id, string Name, string? Description, string Color);

public record UpsertCategoryDto(string Name, string? Description, string Color);