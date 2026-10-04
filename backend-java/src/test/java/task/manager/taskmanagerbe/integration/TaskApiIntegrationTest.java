package task.manager.taskmanagerbe.integration;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;
import task.manager.taskmanagerbe.AbstractIntegrationTest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** End-to-end API tests (controller -> service -> repository -> PostgreSQL). Each test is rolled back. */
@Transactional
class TaskApiIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void createTask_withCategory_returnsCategoryDetailsAndDefaultsToTodo() throws Exception {
        long categoryId = createCategory("Work", "#1976d2");

        ResultActions created = postTask("""
                {"title":"Write report","description":"Draft","priority":"HIGH","categoryId":%d}
                """.formatted(categoryId));

        created.andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Write report"))
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andExpect(jsonPath("$.status").value("TODO"))
                .andExpect(jsonPath("$.categoryId").value(categoryId))
                .andExpect(jsonPath("$.categoryName").value("Work"))
                .andExpect(jsonPath("$.categoryColor").value("#1976d2"));
    }

    @Test
    void createTask_withoutPriorityAndCategory_isAllowed() throws Exception {
        postTask("{\"title\":\"Buy groceries\"}")
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.priority").value((Object) null))
                .andExpect(jsonPath("$.categoryId").value((Object) null));
    }

    @Test
    void getTasks_returnsCreatedTasks() throws Exception {
        long id = createTask("{\"title\":\"First\"}");

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == %d)].title".formatted(id)).value("First"));
    }

    @Test
    void updateTask_replacesFieldsAndClearsPriorityAndCategory() throws Exception {
        long categoryId = createCategory("Work", "#1976d2");
        long id = createTask("{\"title\":\"T\",\"priority\":\"HIGH\",\"categoryId\":%d}".formatted(categoryId));

        mockMvc.perform(put("/api/tasks/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"T\",\"description\":\"edited\",\"status\":\"DONE\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("edited"))
                .andExpect(jsonPath("$.status").value("DONE"))
                .andExpect(jsonPath("$.priority").value((Object) null))
                .andExpect(jsonPath("$.categoryId").value((Object) null))
                .andExpect(jsonPath("$.categoryColor").value((Object) null));
    }

    @Test
    void patchEndpoints_changeStatusPriorityAndCategory() throws Exception {
        long categoryId = createCategory("Home", "#43a047");
        long id = createTask("{\"title\":\"T\"}");

        mockMvc.perform(patch("/api/tasks/{id}/status", id).param("status", "IN_PROGRESS"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
        mockMvc.perform(patch("/api/tasks/{id}/priority", id).param("priority", "LOW"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.priority").value("LOW"));
        mockMvc.perform(patch("/api/tasks/{id}/category", id).param("categoryId", String.valueOf(categoryId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categoryName").value("Home"));
    }

    @Test
    void deleteTask_removesIt() throws Exception {
        long id = createTask("{\"title\":\"T\"}");

        mockMvc.perform(delete("/api/tasks/{id}", id)).andExpect(status().isNoContent());
        mockMvc.perform(get("/api/tasks/{id}", id)).andExpect(status().isNotFound());
    }

    @Test
    void deleteCategory_keepsItsTasksWithoutCategory() throws Exception {
        long categoryId = createCategory("Work", "#1976d2");
        long taskId = createTask("{\"title\":\"T\",\"categoryId\":%d}".formatted(categoryId));

        mockMvc.perform(delete("/api/categories/{id}", categoryId)).andExpect(status().isNoContent());

        mockMvc.perform(get("/api/tasks/{id}", taskId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categoryId").value((Object) null));
    }

    @Test
    void updateCategory_changesTheGivenFields() throws Exception {
        long categoryId = createCategory("Work", "#1976d2");

        mockMvc.perform(put("/api/categories/{id}", categoryId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Office\",\"description\":\"d\",\"color\":\"#e53935\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Office"))
                .andExpect(jsonPath("$.color").value("#e53935"));
    }

    @Test
    void unknownTask_returns404WithErrorBody() throws Exception {
        mockMvc.perform(get("/api/tasks/{id}", 999_999))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.path").value("/api/tasks/999999"));
    }

    @Test
    void createTask_withUnknownCategory_returns404() throws Exception {
        postTask("{\"title\":\"T\",\"categoryId\":999999}").andExpect(status().isNotFound());
    }

    @Test
    void createTask_withBlankTitle_returns400() throws Exception {
        postTask("{\"title\":\"  \"}")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("The title cannot be empty"));
    }

    @Test
    void invalidEnumValues_return400() throws Exception {
        long id = createTask("{\"title\":\"T\"}");

        mockMvc.perform(patch("/api/tasks/{id}/status", id).param("status", "bogus"))
                .andExpect(status().isBadRequest());
        postTask("{\"title\":\"T\",\"priority\":\"BOGUS\"}").andExpect(status().isBadRequest());
    }

    @Test
    void enumEndpoints_exposeNamesAndLabels() throws Exception {
        mockMvc.perform(get("/api/statuses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("TODO"))
                .andExpect(jsonPath("$[0].label").value("To do"))
                .andExpect(jsonPath("$[1].name").value("IN_PROGRESS"))
                .andExpect(jsonPath("$[2].name").value("DONE"));
        mockMvc.perform(get("/api/priorities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("LOW"))
                .andExpect(jsonPath("$[2].label").value("High"));
    }

    private ResultActions postTask(String json) throws Exception {
        return mockMvc.perform(post("/api/tasks").contentType(MediaType.APPLICATION_JSON).content(json));
    }

    private long createTask(String json) throws Exception {
        String body = postTask(json).andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        return ((Number) JsonPath.read(body, "$.id")).longValue();
    }

    private long createCategory(String name, String color) throws Exception {
        String body = mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"%s\",\"color\":\"%s\"}".formatted(name, color)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return ((Number) JsonPath.read(body, "$.id")).longValue();
    }
}
