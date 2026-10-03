import axiosClient from "./axiosClient.ts";
import type {Task} from "../models/Task.ts";

export const getTasks = async (): Promise<Task[]> => {
    const res = await axiosClient.get<Task[]>("/tasks");
    return res.data;
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
    const res = await axiosClient.post<Task>("/tasks", task);
    return res.data;
};