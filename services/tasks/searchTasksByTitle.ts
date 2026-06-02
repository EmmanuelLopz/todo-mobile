import api from '@/services/api';
import { Task } from '@/types/Task';
import { TodoResponse } from './getTasksByListId';

const mapToTask = (item: TodoResponse): Task => ({
  id: String(item.id),
  title: item.title,
  description: item.description ?? '',
  completed:
    item.completed === true ||
    item.status === true ||
    item.status === 1 ||
    item.status === '1',
  priorityName: item.priorityName ?? null,
  dueDate: item.dueDate ?? null,
  priorityId: item.priorityId != null ? String(item.priorityId) : null,
});

// GET /tasks/search/title?title=<query>
// Returns all tasks whose title starts with the given string.
export const searchTasksByTitle = async (title: string): Promise<Task[]> => {
  if (!title.trim()) {
    throw new Error('A title is required to search');
  }

  try {
    const response = await api.get<TodoResponse[]>('/tasks/search/title', {
      params: { title: title.trim() },
    });
    return response.data.map(mapToTask);
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 401) {
      throw new Error('Session expired. Please log in again');
    } else if (status === 403) {
      throw new Error('You do not have permission to search tasks');
    } else if (status === 404) {
      return [];
    } else if (!error.response) {
      throw new Error('Cannot reach the server. Check your connection');
    } else {
      throw new Error('Something went wrong while searching tasks');
    }
  }
};

export default searchTasksByTitle;
