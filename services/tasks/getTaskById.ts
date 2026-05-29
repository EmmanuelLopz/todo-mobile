import api from '@/services/api';
import { TaskDetail } from '@/types/Task';
import { normalizeUuid } from '@/utils/uuid';

// Raw shape returned by the Quarkus backend at GET /tasks/{taskId}.
// Mirrors the `GetTaskByIdResponse` DTO. Fields that may be absent
// are optional so the mapper stays defensive.
export interface GetTaskByIdResponse {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  dueDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  listId?: string | null;
  priorityId?: string | null;
  priorityName?: string | null;
}

// Convert the backend `GetTaskByIdResponse` into the `TaskDetail`
// shape used by the search screen. All UUID fields are normalized to
// the canonical hyphenated form.
const mapToTaskDetail = (item: GetTaskByIdResponse): TaskDetail => ({
  id: normalizeUuid(String(item.id)),
  title: item.title,
  description: item.description ?? '',
  completed: item.completed === true,
  dueDate: item.dueDate ?? null,
  createdAt: item.createdAt ?? null,
  updatedAt: item.updatedAt ?? null,
  listId: item.listId ? normalizeUuid(String(item.listId)) : null,
  priorityId: item.priorityId ? normalizeUuid(String(item.priorityId)) : null,
  priorityName: item.priorityName ?? null,
});

// GET /tasks/{taskId} — returns a single task by its id. `taskId` is a
// UUID; it is normalized to the canonical hyphenated form (the
// BIN_TO_UUID form) before building the URL. The auth interceptor in
// services/api.ts attaches the Firebase idToken automatically.
export const getTaskById = async (taskId: string): Promise<TaskDetail> => {
  if (!taskId) {
    throw new Error('A task id is required to search');
  }

  const normalizedTaskId = normalizeUuid(taskId);

  try {
    const response = await api.get<GetTaskByIdResponse>(
      `/tasks/${encodeURIComponent(normalizedTaskId)}`,
    );
    return mapToTaskDetail(response.data);
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 401) {
      throw new Error('Session expired. Please log in again');
    } else if (status === 403) {
      throw new Error('You do not have permission to view this task');
    } else if (status === 404) {
      throw new Error('No task found with that id');
    } else if (!error.response) {
      throw new Error('Cannot reach the server. Check your connection');
    } else {
      throw new Error('Something went wrong while searching for the task');
    }
  }
};

export default getTaskById;
