namespace task_tracker.Endpoints;

using Microsoft.EntityFrameworkCore;
using task_tracker.Data;
using task_tracker.Dtos;
using task_tracker.Models;

public static class TaskEndpoints
{
    public static void MapTaskEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/tasks").WithOpenApi();

        group.MapGet("/", async (AppDbContext db) =>
            await db.Tasks.Include(t => t.Category).Select(t => ToDto(t)).ToListAsync());

        group.MapGet("/{id:int}", async (int id, AppDbContext db) =>
        {
            var task = await db.Tasks.Include(t => t.Category).FirstOrDefaultAsync(t => t.Id == id);
            return task is null ? Results.NotFound() : Results.Ok(ToDto(task));
        });

        group.MapPost("/", async (CreateTaskDto dto, AppDbContext db) =>
        {
            var task = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description,
                Priority = dto.Priority,
                CategoryId = dto.CategoryId
            };
            db.Tasks.Add(task);
            await db.SaveChangesAsync();
            await db.Entry(task).Reference(t => t.Category).LoadAsync();
            return Results.Created($"/api/tasks/{task.Id}", ToDto(task));
        });

        group.MapPut("/{id:int}", async (int id, UpdateTaskDto dto, AppDbContext db) =>
        {
            var task = await db.Tasks.FindAsync(id);
            if (task is null) return Results.NotFound();

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.Priority = dto.Priority;
            task.Status = dto.Status;
            task.CategoryId = dto.CategoryId;

            await db.SaveChangesAsync();
            await db.Entry(task).Reference(t => t.Category).LoadAsync();
            return Results.Ok(ToDto(task));
        });

        group.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
        {
            var task = await db.Tasks.FindAsync(id);
            if (task is null) return Results.NotFound();
            db.Tasks.Remove(task);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        group.MapPatch("/{id:int}/status", async (int id, Status status, AppDbContext db) =>
        {
            var task = await db.Tasks.Include(t => t.Category).FirstOrDefaultAsync(t => t.Id == id);
            if (task is null) return Results.NotFound();
            task.Status = status;
            await db.SaveChangesAsync();
            return Results.Ok(ToDto(task));
        });

        group.MapPatch("/{id:int}/priority", async (int id, Priority priority, AppDbContext db) =>
        {
            var task = await db.Tasks.Include(t => t.Category).FirstOrDefaultAsync(t => t.Id == id);
            if (task is null) return Results.NotFound();
            task.Priority = priority;
            await db.SaveChangesAsync();
            return Results.Ok(ToDto(task));
        });

        group.MapPatch("/{id:int}/category", async (int id, int categoryId, AppDbContext db) =>
        {
            var task = await db.Tasks.FirstOrDefaultAsync(t => t.Id == id);
            if (task is null) return Results.NotFound();

            var categoryExists = await db.Categories.AnyAsync(c => c.Id == categoryId);
            if (!categoryExists) return Results.BadRequest("Category not found");

            task.CategoryId = categoryId;
            await db.SaveChangesAsync();
            await db.Entry(task).Reference(t => t.Category).LoadAsync();
            return Results.Ok(ToDto(task));
        });
    }

    private static TaskDto ToDto(TaskItem t) =>
        new(t.Id, t.Title, t.Description, t.Priority, t.Status, t.CategoryId, t.Category?.Name);
}