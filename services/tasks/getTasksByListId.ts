import api from '@/services/api';
import { Task } from '@/types/Task';
import { normalizeUuid } from '@/utils/uuid';

// Raw shape returned by the Quarkus backend at GET /tasks/{listId}.
// Mirrors the `Todo` entity. Fields that may be absent are optional so
// the mapper stays defensive.
export interface TodoResponse {
  id: string | number;
  title: string;
  description?: string;
  // `status` is a TINYINT(1) in the database, so it can arrive as
  // 0/1 or as a boolean depending on the serializer.
  status?: number | boolean;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  listId?: string;
  priorityId?: number;
}

// Convert a backend `Todo` into the `Task` shape used by the UI.
const mapToTask = (item: TodoResponse): Task => ({
  id: String(item.id),
  title: item.title,
  description: item.description ?? '',
  completed: item.status === true || item.status === 1,
});

// GET /tasks/{listId} — returns every task that belongs to the given
// list. `listId` is a UUID; the backend stores it as a BINARY value,
// but from the client side it is just passed through as a string in
// the URL path. The auth interceptor in services/api.ts attaches the
// Firebase idToken as a Bearer header automatically.
export const getTasksByListId = async (listId: string): Promise<Task[]> => {
  if (!listId) {
    throw new Error('A list id is required to load its tasks');
  }

  // The backend expects the canonical hyphenated UUID (the BIN_TO_UUID
  // form), e.g. "2435f502-5aae-4d90-8303-326c44b780ce". Normalize here
  // so the URL is correct no matter how the id arrived.
  const normalizedListId = normalizeUuid(listId);

  try {
    const response = await api.get<TodoResponse[]>(
      `/tasks/${encodeURIComponent(normalizedListId)}`,
    );
    return response.data.map(mapToTask);
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 401) {
      throw new Error('Session expired. Please log in again');
    } else if (status === 403) {
      throw new Error('You do not have permission to view these tasks');
    } else if (status === 404) {
      throw new Error('This list could not be found');
    } else if (!error.response) {
      throw new Error('Cannot reach the server. Check your connection');
    } else {
      throw new Error('Something went wrong while loading the tasks');
    }
  }
};

export default getTasksByListId;
