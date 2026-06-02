import { TaskList } from "@/types/TaskList";
import api from "../api";

export interface CreateListDto {
  title: string;
  description?: string;
  colorId?: string;
}

export const createList = async (data: CreateListDto): Promise<TaskList> => {
  try {
    const response = await api.post<TaskList>("/lists", {
      title: data.title,
      description: data.description,
      ...(data.colorId && { colorId: data.colorId }),
    });
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      throw new Error('Session expired. Please log in again.');
    } else if (status === 400) {
      throw new Error('Invalid list data. Please check your input.');
    } else if (!error.response) {
      throw new Error('Cannot reach the server. Check your connection.');
    } else {
      throw new Error('Failed to create list. Please try again.');
    }
  }
};