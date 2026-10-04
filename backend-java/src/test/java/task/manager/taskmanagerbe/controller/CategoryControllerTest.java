package task.manager.taskmanagerbe.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import task.manager.taskmanagerbe.config.SecurityConfig;
import task.manager.taskmanagerbe.dto.CategoryDTO;
import task.manager.taskmanagerbe.service.CategoryService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CategoryController.class)
@Import(SecurityConfig.class)
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CategoryService categoryService;

    @Test
    void create_validCategory_returns201() throws Exception {
        given(categoryService.create(any(CategoryDTO.class)))
                .willReturn(new CategoryDTO(1L, "Work", "Office stuff", "#1976d2"));

        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Work\",\"description\":\"Office stuff\",\"color\":\"#1976d2\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.color").value("#1976d2"));
    }

    @Test
    void create_blankName_returns400() throws Exception {
        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"\",\"color\":\"#1976d2\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Category name is mandatory"));

        verifyNoInteractions(categoryService);
    }
}
