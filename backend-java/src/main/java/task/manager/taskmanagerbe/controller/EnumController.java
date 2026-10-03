package task.manager.taskmanagerbe.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import task.manager.taskmanagerbe.dto.EnumDTO;
import task.manager.taskmanagerbe.model.Priority;
import task.manager.taskmanagerbe.model.Status;
import task.manager.taskmanagerbe.service.EnumService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EnumController {

    private final EnumService enumService;

    public EnumController(EnumService enumService) {
        this.enumService = enumService;
    }

    @GetMapping("/priorities")
    public ResponseEntity<List<EnumDTO>> getPriorities() {
        return ResponseEntity.ok(enumService.getEnumValues(Priority.class));
    }

    @GetMapping("/statuses")
    public ResponseEntity<List<EnumDTO>> getStatuses() {
        return ResponseEntity.ok(enumService.getEnumValues(Status.class));
    }

}
