export type TaskList = {
  id: string;
  title: string;
  subtitle: string;
  percentage: number;
  tags: string[];
  idColor: string;
  idIcon: string;
  /** Hex color value from the backend, e.g. "#3b82f6". Used for the card's sidebar accent. */
  color: string;
};
