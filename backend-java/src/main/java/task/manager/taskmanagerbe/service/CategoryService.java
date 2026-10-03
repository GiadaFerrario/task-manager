package task.manager.taskmanagerbe.service;

import org.springframework.stereotype.Service;
import task.manager.taskmanagerbe.dto.CategoryDTO;
import task.manager.taskmanagerbe.exception.BadRequestException;
import task.manager.taskmanagerbe.exception.ResourceNotFoundException;
import task.manager.taskmanagerbe.model.Category;
import task.manager.taskmanagerbe.model.Task;
import task.manager.taskmanagerbe.repository.CategoryRepository;
import task.manager.taskmanagerbe.repository.TaskRepository;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final TaskRepository taskRepository;


    public CategoryService(CategoryRepository categoryRepository, TaskRepository taskRepository) {
        this.categoryRepository = categoryRepository;
        this.taskRepository = taskRepository;
    }

    public List<CategoryDTO> getAll() {
        return categoryRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public CategoryDTO create(CategoryDTO dto) {
        if (dto.name() == null || dto.name().isBlank()) {
            throw new BadRequestException("Category name is mandatory - cannot be empty");
        }

        Category category = new Category();
        category.setName(dto.name());
        category.setDescription(dto.description());
        category.setColor(dto.color());

        Category saved = categoryRepository.save(category);
        return toDTO(saved);
    }

    public CategoryDTO update(Long id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found - id: " + id));

        if (dto.name() != null && !dto.name().isBlank()) {
            category.setName(dto.name());
        }
        if (dto.description() != null) {
            category.setDescription(dto.description());
        }
        if (dto.color() != null) {
            category.setColor(dto.color());
        }

        Category updated = categoryRepository.save(category);
        return toDTO(updated);
    }

    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found - id: " + id));

        List<Task> tasksWithCategory = taskRepository.findAll().stream()
                .filter(task -> task.getCategory() != null && task.getCategory().getCategoryId().equals(id))
                .toList();

        tasksWithCategory.forEach(task -> task.setCategory(null));
        taskRepository.saveAll(tasksWithCategory);

        // Elimina la categoria
        categoryRepository.delete(category);
    }


    /*** PRIVATE METHODS ***/
    private CategoryDTO toDTO(Category category) {
        return new CategoryDTO(
                category.getCategoryId(),
                category.getName(),
                category.getDescription(),
                category.getColor()
        );
    }

}
