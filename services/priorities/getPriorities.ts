import api from '@/services/api';
import { Priority } from '@/types/Priority';

export interface PriorityResponse {
  id: number | string;
  name: string;
}

const mapToPriority = (item: PriorityResponse): Priority => ({
  id: String(item.id),
  name: item.name,
});

// GET /priorities — returns every priority available in the database.
// The auth interceptor in services/api.ts attaches the Firebase
// idToken as a Bearer header automatically on every call.
export const getPriorities = async (): Promise<Priority[]> => {
  try {
    const response = await api.get<PriorityResponse[]>('/priorities');
    return response.data.map(mapToPriority);
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 401) {
      throw new Error('Session expired. Please log in again');
    } else if (status === 403) {
      throw new Error('You do not have permission to view priorities');
    } else if (!error.response) {
      throw new Error('Cannot reach the server. Check your connection');
    } else {
      throw new Error('Something went wrong while loading priorities');
    }
  }
};

export default getPriorities;
