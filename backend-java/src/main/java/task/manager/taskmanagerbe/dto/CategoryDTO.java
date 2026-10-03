package task.manager.taskmanagerbe.dto;

import jakarta.validation.constraints.NotBlank;
import task.manager.taskmanagerbe.model.Priority;

public record CategoryDTO(Long id,

                          @NotBlank(message = "Category name is mandatory")
                          String name,
                          String description,
                          String color) {
}
