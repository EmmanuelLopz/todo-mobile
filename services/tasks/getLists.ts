import api from '@/services/api';
import { TaskList } from '@/types/TaskList';
import { normalizeUuid } from '@/utils/uuid';

// Raw shape returned by the Quarkus backend at GET /lists.
// The backend now returns hexValue and colorName flat on the root object
// (no nested `color` wrapper). colorId is a UUID string.
export interface ListResponse {
  id: string;
  title: string;
  description?: string;
  userId?: string;
  colorId?: string;
  colorName?: string;
  /** Hex color without the leading '#', e.g. "A855F7". */
  hexValue?: string;
  totalTodos?: number;
  completedTodos?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const DEFAULT_COLOR = '#3b82f6'; // blue-500
const DEFAULT_ICON = 'list';

// Resolve the hex color for a list item.
// The DB stores hexValue without the leading '#', so we prepend it when needed.
const resolveColor = (item: ListResponse): string => {
  if (item.hexValue) {
    const hex = item.hexValue.trim();
    return hex.startsWith('#') ? hex : `#${hex}`;
  }
  return DEFAULT_COLOR;
};

// Convert a backend `ListResponse` into the `TaskList` shape consumed
// by `TaskListCard`. Percentage is derived from completed/total todos
// when those fields are present; otherwise it falls back to 0.
const mapToTaskList = (item: ListResponse): TaskList => {
  const total = item.totalTodos ?? 0;
  const completed = item.completedTodos ?? 0;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const color = resolveColor(item);

  return {
    // The backend id is a BINARY(16) UUID. Normalize it so navigation
    // params and later /tasks/{listId} calls use the canonical form.
    id: normalizeUuid(String(item.id)),
    title: item.title,
    subtitle: item.description ?? '',
    percentage,
    tags: [],
    idColor: color, // kept for backward-compat; now also a hex string
    color,
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
