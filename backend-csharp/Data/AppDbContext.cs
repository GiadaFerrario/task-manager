namespace task_tracker.Data;

using Microsoft.EntityFrameworkCore;
using task_tracker.Models;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<TaskItem> Tasks => Set<TaskItem>();
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaskItem>()
            .Property(t => t.Status)
            .HasConversion<string>();

        modelBuilder.Entity<TaskItem>()
            .Property(t => t.Priority)
            .HasConversion<string>();
    }
}