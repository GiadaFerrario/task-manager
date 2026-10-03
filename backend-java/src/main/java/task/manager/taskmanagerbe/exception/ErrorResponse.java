package task.manager.taskmanagerbe.exception;

public record ErrorResponse(int status, String error, String message, String path) {
}
