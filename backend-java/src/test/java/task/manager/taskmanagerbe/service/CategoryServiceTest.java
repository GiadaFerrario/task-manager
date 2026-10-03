package task.manager.taskmanagerbe.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import task.manager.taskmanagerbe.dto.CategoryDTO;
import task.manager.taskmanagerbe.exception.BadRequestException;
import task.manager.taskmanagerbe.exception.ResourceNotFoundException;
import task.manager.taskmanagerbe.model.Category;
import task.manager.taskmanagerbe.model.Task;
import task.manager.taskmanagerbe.repository.CategoryRepository;
import task.manager.taskmanagerbe.repository.TaskRepository;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private CategoryService categoryService;

    private Category category;

    @BeforeEach
    public void setup() {
        category = new Category(1L, "Category", "This is a test category", "#FFFFFF");
    }

    @Test
    public void getAll_ok() {
        given(categoryRepository.findAll()).willReturn(List.of(category));

        List<CategoryDTO> result = categoryService.getAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(1L);
    }

    @Test
    public void create_ok() {
        // given
        CategoryDTO dto = new CategoryDTO(null, "Other category", "Description", "#FF0000");
        given(categoryRepository.save(any(Category.class))).willAnswer(inv -> {
            Category c = inv.getArgument(0);
            c.setCategoryId(2L);
            return c;
        });

        // when
        CategoryDTO result = categoryService.create(dto);

        // then
        assertThat(result.id()).isEqualTo(2L);
        assertThat(result.name()).isEqualTo("Other category");
    }

    @Test
    public void create_blankTitle_exception() {
        CategoryDTO dto = new CategoryDTO(null, " ", "Desc", "#FFFFFF");
        assertThatThrownBy(() -> categoryService.create(dto))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Category name is mandatory - cannot be empty");
    }

    @Test
    public void update_ok() {
        given(categoryRepository.findById(1L)).willReturn(Optional.of(category));
        given(categoryRepository.save(any(Category.class))).willAnswer(inv -> inv.getArgument(0));

        CategoryDTO update = new CategoryDTO(1L, "Updated", "Desc", "#000000");

        CategoryDTO result = categoryService.update(1L, update);

        assertThat(result.name()).isEqualTo("Updated");
        assertThat(result.description()).isEqualTo("Desc");
        assertThat(result.color()).isEqualTo("#000000");
        then(categoryRepository).should(times(1)).save(any(Category.class));
    }

    @Test
    public void update_notFound_exception() {
        given(categoryRepository.findById(99L)).willReturn(Optional.empty());
        CategoryDTO dto = new CategoryDTO(99L, "DoesNotExist", "Desc", "#FFFFFF");

        assertThatThrownBy(() -> categoryService.update(99L, dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Category not found");
    }

    @Test
    public void delete_ok() {
        Task task1 = new Task();
        task1.setTaskId(1L);
        task1.setCategory(category);

        Task task2 = new Task();
        task2.setTaskId(2L);
        task2.setCategory(category);

        given(categoryRepository.findById(1L)).willReturn(Optional.of(category));
        given(taskRepository.findAll()).willReturn(List.of(task1, task2));

        categoryService.delete(1L);

        assertThat(task1.getCategory()).isNull();
        assertThat(task2.getCategory()).isNull();
        then(taskRepository).should(times(1)).saveAll(anyList());
        then(categoryRepository).should(times(1)).delete(category);
    }

    @Test
    public void delete_notFound_exception() {
        given(categoryRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Category not found - id: 99");
    }
}
