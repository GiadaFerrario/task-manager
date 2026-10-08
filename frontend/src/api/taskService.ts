import axiosClient from "./axiosClient.ts";
import type {Task} from "../models/Task.ts";
import type {Status} from "../models/Status.ts";
import type {Priority} from "../models/Priority.ts";

export const getTasks = async (): Promise<Task[]> => {
    const res = await axiosClient.get<Task[]>("/tasks");
    return res.data;
};

export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
    const res = await axiosClient.put<Task>(`/tasks/${id}`, task);
    return res.data;
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
    const res = await axiosClient.post<Task>("/tasks", task);
    return res.data;
};

export const deleteTask = async (id: number): Promise<void> => {
    await axiosClient.delete(`/tasks/${id}`);
};

export const updateTaskStatus = async (id: number, status: Status): Promise<Task> => {
    const res = await axiosClient.patch<Task>(`/tasks/${id}/status`, null, {params: {status}});
    return res.data;
};

export const updateTaskPriority = async (id: number, priority: Priority): Promise<Task> => {
    const res = await axiosClient.patch<Task>(`/tasks/${id}/priority`, null, {params: {priority}});
    return res.data;
};
