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

        group.MapPost("/", async (UpsertCategoryDto dto, AppDbContext db) =>
        {
            var category = new Category { Name = dto.Name, Description = dto.Description, Color = dto.Color };
            db.Categories.Add(category);
            await db.SaveChangesAsync();
            return Results.Created($"/api/categories/{category.Id}", ToDto(category));
        });

        group.MapPut("/{id:int}", async (int id, UpsertCategoryDto dto, AppDbContext db) =>
        {
            var category = await db.Categories.FindAsync(id);
            if (category is null) return Results.NotFound();

            category.Name = dto.Name;
            category.Description = dto.Description;
            category.Color = dto.Color;

            await db.SaveChangesAsync();
            return Results.Ok(ToDto(category));
        });

        group.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
        {
            var category = await db.Categories.FindAsync(id);
            if (category is null) return Results.NotFound();
            db.Categories.Remove(category);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }

    private static CategoryDto ToDto(Category c) => new(c.Id, c.Name, c.Description, c.Color);
}