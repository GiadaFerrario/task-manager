package task.manager.taskmanagerbe.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import task.manager.taskmanagerbe.config.SecurityConfig;
import task.manager.taskmanagerbe.dto.TaskDTO;
import task.manager.taskmanagerbe.exception.ResourceNotFoundException;
import task.manager.taskmanagerbe.model.Priority;
import task.manager.taskmanagerbe.model.Status;
import task.manager.taskmanagerbe.service.TaskService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TaskController.class)
@Import(SecurityConfig.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TaskService taskService;

    @Test
    void create_validTask_returns201() throws Exception {
        given(taskService.create(any(TaskDTO.class)))
                .willReturn(new TaskDTO(1L, "T", null, Priority.LOW, Status.TODO, null, null, null));

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"T\",\"priority\":\"LOW\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void create_blankTitle_returns400WithoutCallingTheService() throws Exception {
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Error"));

        verifyNoInteractions(taskService);
    }

    @Test
    void getById_unknownTask_returns404() throws Exception {
        given(taskService.getById(42L)).willThrow(new ResourceNotFoundException("Task not found with id: 42"));

        mockMvc.perform(get("/api/tasks/42"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Task not found with id: 42"));
    }

    @Test
    void patchStatus_invalidEnumValue_returns400() throws Exception {
        mockMvc.perform(patch("/api/tasks/1/status").param("status", "bogus"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid value 'bogus' for parameter 'status'"));

        verifyNoInteractions(taskService);
    }

    @Test
    void create_invalidEnumInBody_returns400() throws Exception {
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"T\",\"priority\":\"BOGUS\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Malformed or invalid request body"));
    }
}
