import api from '@/services/api';
import { Color } from '@/types/Color';

// Raw shape returned by the Quarkus backend at GET /colors.
// id arrives as a number from the INT primary key; name and hexValue
// mirror the Color entity columns.
export interface ColorResponse {
  id: number | string;
  name: string;
  /** 6-character hex value without the '#' prefix, e.g. "2563EB". */
  hexValue: string;
}

// Convert a backend ColorResponse into the Color shape used by the UI.
const mapToColor = (item: ColorResponse): Color => ({
  id: String(item.id),
  name: item.name,
  hexValue: item.hexValue,
});

// GET /colors — returns every color available in the database.
// The auth interceptor in services/api.ts attaches the Firebase
// idToken as a Bearer header automatically on every call.
export const getColors = async (): Promise<Color[]> => {
  try {
    const response = await api.get<ColorResponse[]>('/colors');
    return response.data.map(mapToColor);
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 401) {
      throw new Error('Session expired. Please log in again');
    } else if (status === 403) {
      throw new Error('You do not have permission to view colors');
    } else if (!error.response) {
      throw new Error('Cannot reach the server. Check your connection');
    } else {
      throw new Error('Something went wrong while loading colors');
    }
  }
};

export default getColors;
