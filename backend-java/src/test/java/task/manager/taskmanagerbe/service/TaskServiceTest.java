package task.manager.taskmanagerbe.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import task.manager.taskmanagerbe.dto.TaskDTO;
import task.manager.taskmanagerbe.exception.BadRequestException;
import task.manager.taskmanagerbe.exception.ResourceNotFoundException;
import task.manager.taskmanagerbe.model.Category;
import task.manager.taskmanagerbe.model.Priority;
import task.manager.taskmanagerbe.model.Status;
import task.manager.taskmanagerbe.model.Task;
import task.manager.taskmanagerbe.repository.CategoryRepository;
import task.manager.taskmanagerbe.repository.TaskRepository;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.times;


@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private TaskService taskService;

    private Category category;
    private Task task;

    @BeforeEach
    public void setup() {
        category = new Category(1L, "Category", "This is a test category", "#FFFFFF");
        task = new Task(1L, "Task", "This is a test task", Priority.LOW, Status.TODO, category);
    }

    @Test
    public void getAll_ok() {
        given(taskRepository.findAll()).willReturn(List.of(task));

        List<TaskDTO> dtos = taskService.getAll();

        assertThat(dtos).isNotEmpty();
        assertThat(dtos.get(0).title()).isEqualTo("Task");
        assertThat(dtos.get(0).categoryName()).isEqualTo("Category");
        then(taskRepository).should(times(1)).findAll();
    }

    @Test
    public void getById_notFound_exception() {
        given(taskRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Task not found with id: 99");
    }

    @Test
    public void create_blankTitle_exception() {
        TaskDTO dto = new TaskDTO(
                null,
                "",
                "description",
                Priority.HIGH,
                Status.TODO,
                category.getCategoryId(),
                category.getName()
        );

        assertThatThrownBy(() -> taskService.create(dto))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Title is mandatory - cannot be empty");
    }

    @Test
    public void update_ok() {
        TaskDTO updateDTO = new TaskDTO(1L, "New Title", "New Desc", Priority.HIGH, Status.IN_PROGRESS, category.getCategoryId(), category.getName());
        given(taskRepository.findById(1L)).willReturn(Optional.of(task));
        given(categoryRepository.findById(1L)).willReturn(Optional.of(category));
        given(taskRepository.save(any(Task.class))).willAnswer(inv -> inv.getArgument(0));

        TaskDTO result = taskService.update(1L, updateDTO);

        assertThat(result.title()).isEqualTo("New Title");
        assertThat(result.priority()).isEqualTo(Priority.HIGH);
        assertThat(result.status()).isEqualTo(Status.IN_PROGRESS);
        then(taskRepository).should(times(1)).save(any(Task.class));
    }

    @Test
    public void update_notFound_exception() {
        given(taskRepository.findById(99L)).willReturn(Optional.empty());
        TaskDTO dto = new TaskDTO(99L, "Test", "Description", Priority.LOW, Status.TODO, category.getCategoryId(), category.getName());

        assertThatThrownBy(() -> taskService.update(99L, dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Task not found with id: 99");
    }

    @Test
    public void delete_ok() {
        given(taskRepository.existsById(1L)).willReturn(true);

        taskService.delete(1L);

        then(taskRepository).should(times(1)).deleteById(1L);
    }

    @Test
    public void delete_notFound_exception() {
        given(taskRepository.existsById(99L)).willReturn(false);

        assertThatThrownBy(() -> taskService.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Task not found with id: 99");
    }

    @Test
    public void changeStatus_ok() {
        // given
        given(taskRepository.findById(1L)).willReturn(Optional.of(task));

        // when
        TaskDTO dto = taskService.changeStatus(1L, Status.DONE);

        // then
        assertThat(dto.status()).isEqualTo(Status.DONE);
        then(taskRepository).should(times(1)).findById(1L);
    }

    @Test
    public void changeStatus_notFound_exception() {
        given(taskRepository.findById(99L)).willReturn(Optional.empty());
        assertThatThrownBy(() -> taskService.changeStatus(99L, Status.DONE))
                .isInstanceOf(ResourceNotFoundException.class);
    }


    @Test
    public void changePriority_ok() {
        given(taskRepository.findById(1L)).willReturn(Optional.of(task));
        TaskDTO dto = taskService.changePriority(1L, Priority.HIGH);
        assertThat(dto.priority()).isEqualTo(Priority.HIGH);
    }

    @Test
    public void changePriority_notFound_exception() {
        given(taskRepository.findById(99L)).willReturn(Optional.empty());
        assertThatThrownBy(() -> taskService.changePriority(99L, Priority.HIGH))
                .isInstanceOf(ResourceNotFoundException.class);
    }


    @Test
    public void changeCategory_ok() {
        given(taskRepository.findById(1L)).willReturn(Optional.of(task));
        given(categoryRepository.findById(2L)).willReturn(Optional.of(new Category() {{
            setCategoryId(2L);
            setName("Other category");
        }}));

        TaskDTO dto = taskService.changeCategory(1L, 2L);

        assertThat(dto.categoryName()).isEqualTo("Other category");
    }

    @Test
    public void changeCategory_notFound_exception() {
        given(taskRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.changeCategory(99L, 1L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
