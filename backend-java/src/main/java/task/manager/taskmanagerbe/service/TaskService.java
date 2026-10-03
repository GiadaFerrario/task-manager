package task.manager.taskmanagerbe.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
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

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;


    public TaskService(TaskRepository taskRepository, CategoryRepository categoryRepository) {
        this.taskRepository = taskRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<TaskDTO> getAll() {
        return taskRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public TaskDTO getById(Long id) {
        return taskRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    public TaskDTO create(TaskDTO dto) {
        if (dto.title() == null || dto.title().isBlank()) {
            throw new BadRequestException("Title is mandatory - cannot be empty");
        }
        Task task = new Task();
        task.setTitle(dto.title());
        task.setDescription(dto.description());
        task.setPriority(dto.priority() != null ? dto.priority() : null); // default priority -> no priority
        task.setStatus(Status.TODO); // default status
        task.setCategory(getCategoryOrNull(dto.categoryId()));

        Task saved = taskRepository.save(task);
        return toDTO(saved);
    }

    @Transactional
    public TaskDTO update(Long id, TaskDTO dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        task.setTitle(dto.title());
        task.setDescription(dto.description());
        if (dto.priority() != null) task.setPriority(dto.priority());
        if (dto.status() != null) task.setStatus(dto.status());
        task.setCategory(getCategoryOrNull(dto.categoryId()));

        return toDTO(taskRepository.save(task));
    }

    public void delete(Long id) {
        if (!taskRepository.existsById(id))
            throw new ResourceNotFoundException("Task not found with id: " + id);
        taskRepository.deleteById(id);
    }

    @Transactional
    public TaskDTO changeStatus(Long id, Status status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        task.setStatus(status);
        return toDTO(task);
    }

    @Transactional
    public TaskDTO changePriority(Long id, Priority priority) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        task.setPriority(priority);
        return toDTO(task);
    }

    @Transactional
    public TaskDTO changeCategory(Long id, Long categoryId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        task.setCategory(getCategoryOrNull(categoryId));
        return toDTO(task);
    }

    /*** PRIVATE METHODS ***/

    private Category getCategoryOrNull(Long categoryId) {
        if (categoryId == null) return null;
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
    }

    private TaskDTO toDTO(Task task) {
        return new TaskDTO(
                task.getTaskId(),
                task.getTitle(),
                task.getDescription(),
                task.getPriority(),
                task.getStatus(),
                task.getCategory() != null ? task.getCategory().getCategoryId() : null,
                task.getCategory() != null ? task.getCategory().getName() : null
        );
    }

}
