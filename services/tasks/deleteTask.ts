import api from '@/services/api';
import { normalizeUuid } from '@/utils/uuid';

/**
 * Delete an existing task on the backend.
 *
 * Calls DELETE /task/{taskId}, mirroring the singular path used by
 * GET /task/{taskId} and PUT /task/{taskId} on the Quarkus TaskResource.
 * The auth interceptor in services/api.ts attaches the Firebase idToken
 * automatically.
 *
 * @param taskId - The UUID of the task to delete
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  if (!taskId) {
    throw new Error('A task id is required to delete it');
  }

  const normalizedTaskId = normalizeUuid(taskId);

  try {
    await api.delete(`/task/${encodeURIComponent(normalizedTaskId)}`);
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 401) {
      throw new Error('Session expired. Please log in again');
    } else if (status === 403) {
      throw new Error('You do not have permission to delete this task');
    } else if (status === 404) {
      throw new Error('This task could not be found');
    } else if (!error.response) {
      throw new Error('Cannot reach the server. Check your connection');
    } else {
      throw new Error('Failed to delete task');
    }
  }
};

export default deleteTask;
