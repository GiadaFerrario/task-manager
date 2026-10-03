import {Priority} from "./Priority.ts";
import {Status} from "./Status.ts";

export interface Task {
    id: number,
    title: string,
    description?: string;
    priority: Priority;
    status: Status;
    categoryId?: number | null;
    categoryName?: string | null;
    categoryColor?: string | null;
}