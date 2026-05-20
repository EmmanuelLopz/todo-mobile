// Shape of a task (Todo) as consumed by the UI: TaskItem and the
// list detail screen. The backend `Todo` entity is translated into
// this shape by services/tasks/getTasksByListId.ts.
export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};
