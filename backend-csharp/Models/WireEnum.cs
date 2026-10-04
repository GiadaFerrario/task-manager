namespace task_tracker.Models;

using System.Text.Json;

/// <summary>
/// The API contract (shared with the Java backend and the frontend) writes enums as UPPER_SNAKE_CASE
/// (e.g. IN_PROGRESS), while C# members stay PascalCase (InProgress).
/// </summary>
public static class WireEnum
{
    public static string ToWire<T>(T value) where T : struct, Enum =>
        JsonNamingPolicy.SnakeCaseUpper.ConvertName(value.ToString());

    public static bool TryParse<T>(string? wire, out T value) where T : struct, Enum
    {
        foreach (var candidate in Enum.GetValues<T>())
        {
            if (string.Equals(ToWire(candidate), wire, StringComparison.OrdinalIgnoreCase))
            {
                value = candidate;
                return true;
            }
        }

        value = default;
        return false;
    }
}
