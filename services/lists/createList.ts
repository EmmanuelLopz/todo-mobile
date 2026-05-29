import { TaskList } from "@/types/TaskList";
import api from "../api";
import { getToken } from "../authService";

export interface CreateListDto {
  title: string;
  description?: string;
  userId: string;
  colorId?: string;
}

export const createList = async (
  data: CreateListDto
): Promise<TaskList> => {
  const token = await getToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await api.post<TaskList>("/lists", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};