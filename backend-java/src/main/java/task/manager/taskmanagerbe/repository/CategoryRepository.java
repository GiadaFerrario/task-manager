package task.manager.taskmanagerbe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import task.manager.taskmanagerbe.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
