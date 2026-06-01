import { TaskList } from "@/types/TaskList";
import api from "../api";

export interface UpdateListDto {
  title: string;
  description?: string;
  colorId?: string;
}

export const updateList = async (id: string, data: UpdateListDto): Promise<TaskList> => {
  const response = await api.put<TaskList>(`/lists/${id}`, {
    title: data.title,
    description: data.description,
    colorId: data.colorId || undefined,
  });

  return response.data;
};
