import { Task } from "@/types/Task";
import api from "../api";
import { getToken } from "../authService";

export interface CreateTaskDto {
  title: string;
  description?: string;
  listId: string;
  priorityId?: string;
  dueDate?: string;
}

export const createTask = async (
  data: CreateTaskDto
): Promise<Task> => {
  const token = await getToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await api.post<Task>("/tasks", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};