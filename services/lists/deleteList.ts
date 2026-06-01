import api from "../api";

export const deleteList = async (id: string): Promise<void> => {
  await api.delete(`/lists/${id}`);
};
