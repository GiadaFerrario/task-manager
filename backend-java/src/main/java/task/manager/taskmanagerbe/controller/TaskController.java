package task.manager.taskmanagerbe.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import task.manager.taskmanagerbe.dto.TaskDTO;
import task.manager.taskmanagerbe.model.Priority;
import task.manager.taskmanagerbe.model.Status;
import task.manager.taskmanagerbe.service.TaskService;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAll() {
        return ResponseEntity.ok(taskService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getById(id));
    }

    @PostMapping
    public ResponseEntity<TaskDTO> create(@Valid @RequestBody TaskDTO task) {
        TaskDTO saved = taskService.create(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> update(@PathVariable Long id, @Valid @RequestBody TaskDTO dto) {
        return ResponseEntity.ok(taskService.update(id, dto));
    }


    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskDTO> updateStatus(@PathVariable Long id, @RequestParam Status status) {
        return ResponseEntity.ok(taskService.changeStatus(id, status));
    }

    @PatchMapping("/{id}/priority")
    public ResponseEntity<TaskDTO> updatePriority(@PathVariable Long id, @RequestParam Priority priority) {
        return ResponseEntity.ok(taskService.changePriority(id, priority));
    }

    @PatchMapping("/{id}/category")
    public ResponseEntity<TaskDTO> updateCategory(@PathVariable Long id, @RequestParam Long categoryId) {
        return ResponseEntity.ok(taskService.changeCategory(id, categoryId));
    }


}
