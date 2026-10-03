package task.manager.taskmanagerbe.service;

import org.springframework.stereotype.Service;
import task.manager.taskmanagerbe.dto.EnumDTO;
import task.manager.taskmanagerbe.model.LabeledEnum;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnumService {

    public <E extends Enum<E> & LabeledEnum> List<EnumDTO> getEnumValues(Class<E> enumClass) {
        return Arrays.stream(enumClass.getEnumConstants())
                .map(e -> new EnumDTO(e.name(), e.getLabel()))
                .collect(Collectors.toList());
    }
}
