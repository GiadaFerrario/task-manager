export const Priority = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];


export const PRIORITY_LABELS: Record<Priority, string> = {
    [Priority.LOW]: "Low",
    [Priority.MEDIUM]: "Medium",
    [Priority.HIGH]: "High",
};
