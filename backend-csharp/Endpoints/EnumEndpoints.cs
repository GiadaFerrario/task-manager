namespace task_tracker.Endpoints;

using task_tracker.Dtos;
using task_tracker.Models;

public static class EnumEndpoints
{
    public static void MapEnumEndpoints(this WebApplication app)
    {
        app.MapGet("/api/priorities", () =>
            Enum.GetValues<Priority>().Select(p => new EnumDto(WireEnum.ToWire(p), p.Label())));

        app.MapGet("/api/statuses", () =>
            Enum.GetValues<Status>().Select(s => new EnumDto(WireEnum.ToWire(s), s.Label())));
    }
}