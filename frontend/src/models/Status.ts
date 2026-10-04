export const Status = {
    TODO: "TODO",
    IN_PROGRESS: "IN_PROGRESS",
    DONE: "DONE",
} as const;

export type Status = (typeof Status)[keyof typeof Status];


export const STATUS_LABELS: Record<Status, string> = {
    [Status.TODO]: "To do",
    [Status.IN_PROGRESS]: "In progress",
    [Status.DONE]: "Done",
};
