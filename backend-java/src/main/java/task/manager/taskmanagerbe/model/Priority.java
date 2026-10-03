package task.manager.taskmanagerbe.model;

public enum Priority implements LabeledEnum{
    LOW("Low"), MEDIUM("Medium"), HIGH("High");

    private final String label;

    Priority(String label) {
        this.label = label;
    }

    @Override
    public String getLabel() {
        return label;
    }
}
