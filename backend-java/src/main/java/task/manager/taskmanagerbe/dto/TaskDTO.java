package task.manager.taskmanagerbe.dto;

import jakarta.validation.constraints.NotBlank;

import task.manager.taskmanagerbe.model.Priority;
import task.manager.taskmanagerbe.model.Status;

public record TaskDTO(Long id,
                      @NotBlank(message = "The title cannot be empty")
                      String title,
                      String description,
                      Priority priority,
                      Status status,
                      Long categoryId,
                      String categoryName) {
}
