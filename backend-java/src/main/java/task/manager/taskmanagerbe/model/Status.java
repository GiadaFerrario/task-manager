package task.manager.taskmanagerbe.model;

public enum Status implements LabeledEnum{
    TODO("To do"), IN_PROGRESS("In progress"), DONE("Done");

    private String label;

    Status(String label) {
        this.label = label;
    }

    @Override
    public String getLabel() {
        return label;
    }
}
