namespace task_tracker.Dtos;

/// <summary>Same error shape as the Java backend, so the frontend can read <c>message</c> from either.</summary>
public record ErrorResponse(int Status, string Error, string Message, string Path)
{
    public static IResult NotFound(HttpContext context, string message) =>
        Results.NotFound(new ErrorResponse(StatusCodes.Status404NotFound, "Resource Not Found", message, context.Request.Path));

    public static IResult BadRequest(HttpContext context, string message) =>
        Results.BadRequest(new ErrorResponse(StatusCodes.Status400BadRequest, "Bad Request", message, context.Request.Path));
}
