export const Priority = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];
