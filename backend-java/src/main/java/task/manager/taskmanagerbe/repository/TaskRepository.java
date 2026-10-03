package task.manager.taskmanagerbe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import task.manager.taskmanagerbe.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
