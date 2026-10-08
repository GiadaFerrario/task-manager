import axiosClient from "./axiosClient.ts";
import type {Category} from "../models/Category.ts";

export const getCategories = async (): Promise<Category[]> => {
    const res = await axiosClient.get<Category[]>("/categories");
    return res.data;
};

export const createCategory = async (category: Omit<Category, "id">): Promise<Category> => {
    const res = await axiosClient.post<Category>("/categories", category);
    return res.data;
};

export const updateCategory = async (id: number, category: Omit<Category, "id">): Promise<Category> => {
    const res = await axiosClient.put<Category>(`/categories/${id}`, category);
    return res.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
    await axiosClient.delete(`/categories/${id}`);
};
