package task.manager.taskmanagerbe.model;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;

    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    @Nullable
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY) // more tasks can have the same category but a task can have only one or zero category
    @JoinColumn(name = "category_id")
    @Nullable
    private Category category;
}