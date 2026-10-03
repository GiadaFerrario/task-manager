import axiosClient from "./axiosClient.ts";
import type {Category} from "../models/Category.ts";

export const getTasks = async (): Promise<Category[]> => {
    const res = await axiosClient.get<Category[]>("/categories");
    return res.data;
};

export const createTask = async (category: Partial<Category>): Promise<Category> => {
    const res = await axiosClient.post<Category>("/categories", category);
    return res.data;
};