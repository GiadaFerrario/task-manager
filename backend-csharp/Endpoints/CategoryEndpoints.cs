namespace task_tracker.Endpoints;

using Microsoft.EntityFrameworkCore;
using task_tracker.Data;
using task_tracker.Dtos;
using task_tracker.Models;

public static class CategoryEndpoints
{
    public static void MapCategoryEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/categories").WithOpenApi();

        group.MapGet("/", async (AppDbContext db) =>
            await db.Categories.Select(c => ToDto(c)).ToListAsync());

        group.MapPost("/", async (UpsertCategoryDto dto, AppDbContext db, HttpContext http) =>
        {
            if (string.IsNullOrWhiteSpace(dto.Name)) return ErrorResponse.BadRequest(http, "Category name is mandatory - cannot be empty");
            var category = new Category { Name = dto.Name, Description = dto.Description, Color = ColorOrDefault(dto.Color) };
            db.Categories.Add(category);
            await db.SaveChangesAsync();
            return Results.Created($"/api/categories/{category.Id}", ToDto(category));
        });

        group.MapPut("/{id:int}", async (int id, UpsertCategoryDto dto, AppDbContext db, HttpContext http) =>
        {
            if (string.IsNullOrWhiteSpace(dto.Name)) return ErrorResponse.BadRequest(http, "Category name is mandatory - cannot be empty");
            var category = await db.Categories.FindAsync(id);
            if (category is null) return ErrorResponse.NotFound(http, $"Category not found - id: {id}");

            category.Name = dto.Name;
            category.Description = dto.Description;
            category.Color = ColorOrDefault(dto.Color);

            await db.SaveChangesAsync();
            return Results.Ok(ToDto(category));
        });

        group.MapDelete("/{id:int}", async (int id, AppDbContext db, HttpContext http) =>
        {
            var category = await db.Categories.FindAsync(id);
            if (category is null) return ErrorResponse.NotFound(http, $"Category not found - id: {id}");

            // like the Java backend: the tasks of a deleted category are kept, without category
            await using var transaction = await db.Database.BeginTransactionAsync();
            await db.Tasks.Where(t => t.CategoryId == id)
                .ExecuteUpdateAsync(s => s.SetProperty(t => t.CategoryId, (int?)null));
            db.Categories.Remove(category);
            await db.SaveChangesAsync();
            await transaction.CommitAsync();
            return Results.NoContent();
        });
    }

    private const string DefaultColor = "#9e9e9e";

    private static string ColorOrDefault(string? color) => string.IsNullOrWhiteSpace(color) ? DefaultColor : color;

    private static CategoryDto ToDto(Category c) => new(c.Id, c.Name, c.Description, c.Color);
}