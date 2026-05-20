import api from '@/services/api';
import { TaskList } from '@/types/TaskList';
import { normalizeUuid } from '@/utils/uuid';

// Raw shape returned by the Quarkus backend at GET /lists.
// Mirrors the `List` entity (plus optional aggregate fields the backend
// exposes for the UI). Anything that may be missing is marked optional
// so the mapper stays defensive.
export interface ListResponse {
  id: number;
  title: string;
  description?: string;
  userId?: number;
  colorId?: number;
  color?: {
    id: number;
    name: string;
    hexValue: string;
  };
  totalTodos?: number;
  completedTodos?: number;
}

// Fallback Tailwind classes used when the backend doesn't return a color
// or returns an unknown color id. Keeps the UI consistent with the
// already-defined TaskListCard structure.
const COLOR_MAP: Record<number, string> = {
  1: 'bg-blue-500',
  2: 'bg-green-500',
  3: 'bg-purple-500',
  4: 'bg-red-500',
  5: 'bg-yellow-500',
};

const DEFAULT_COLOR = 'bg-blue-500';
const DEFAULT_ICON = 'list';

// Convert a backend `ListResponse` into the `TaskList` shape consumed
// by `TaskListCard`. Percentage is derived from completed/total todos
// when those fields are present; otherwise it falls back to 0.
const mapToTaskList = (item: ListResponse): TaskList => {
  const total = item.totalTodos ?? 0;
  const completed = item.completedTodos ?? 0;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    // The backend id is a BINARY(16) UUID. Normalize it so navigation
    // params and later /tasks/{listId} calls use the canonical form.
    id: normalizeUuid(String(item.id)),
    title: item.title,
    subtitle: item.description ?? '',
    percentage,
    tags: [],
    idColor: COLOR_MAP[item.colorId ?? -1] ?? DEFAULT_COLOR,
    idIcon: DEFAULT_ICON,
  };
};

// GET /lists — returns every list owned by the authenticated user.
// The auth interceptor in `services/api.ts` attaches the Firebase
// idToken as a Bearer header on every call, so this just needs to
// make the request and translate the payload.
export const getLists = async (): Promise<TaskList[]> => {
  try {
    const response = await api.get<ListResponse[]>('/lists');
    return response.data.map(mapToTaskList);
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 401) {
      throw new Error('Session expired. Please log in again');
    } else if (status === 403) {
      throw new Error('You do not have permission to view these lists');
    } else if (!error.response) {
      throw new Error('Cannot reach the server. Check your connection');
    } else {
      throw new Error('Something went wrong while loading your lists');
    }
  }
};

export default getLists;
