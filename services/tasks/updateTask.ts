import api from '@/services/api';
import { Task } from '@/types/Task';

export interface UpdateTaskRequest {
  status?: boolean;
  title?: string;
  description?: string;
  dueDate?: string;
  priorityId?: string;
}

/**
 * Update an existing task on the backend.
 * At minimum, updates the task's status (completion state).
 *
 * @param taskId - The ID of the task to update
 * @param updates - Object containing fields to update (status, title, etc.)
 * @returns The updated task
 */
export const updateTask = async (
  taskId: string,
  updates: UpdateTaskRequest,
): Promise<void> => {
  if (!taskId) {
    throw new Error('A task ID is required to update it');
  }

  try {
    await api.put(`/task/${encodeURIComponent(taskId)}`, updates);
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 401) {
      throw new Error('Session expired. Please log in again');
    } else if (status === 403) {
      throw new Error('You do not have permission to update this task');
    } else if (status === 404) {
      throw new Error('This task could not be found');
    } else if (!error.response) {
      throw new Error('Cannot reach the server. Check your connection');
    } else {
      throw new Error('Failed to update task');
    }
  }
};

export default updateTask;
