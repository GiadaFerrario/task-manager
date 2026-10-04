package task.manager.taskmanagerbe.service;

import org.junit.jupiter.api.Test;
import task.manager.taskmanagerbe.dto.EnumDTO;
import task.manager.taskmanagerbe.model.Priority;
import task.manager.taskmanagerbe.model.Status;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class EnumServiceTest {

    private final EnumService enumService = new EnumService();

    @Test
    void getEnumValues_status_returnsNameAndLabelInDeclarationOrder() {
        List<EnumDTO> values = enumService.getEnumValues(Status.class);

        assertThat(values).containsExactly(
                new EnumDTO("TODO", "To do"),
                new EnumDTO("IN_PROGRESS", "In progress"),
                new EnumDTO("DONE", "Done"));
    }

    @Test
    void getEnumValues_priority_returnsAllValues() {
        assertThat(enumService.getEnumValues(Priority.class))
                .extracting(EnumDTO::name)
                .containsExactly("LOW", "MEDIUM", "HIGH");
    }
}
