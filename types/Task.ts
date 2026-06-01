// Shape of a task (Todo) as consumed by the UI: TaskItem and the
// list detail screen. The backend `Todo` entity is translated into
// this shape by services/tasks/getTasksByListId.ts.
export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priorityName?: string | null;
  // Optional details carried through from getTasksByListId so the
  // three-dot "Modify task" action can prefill the edit screen without
  // an extra request. Absent for tasks loaded by older code paths.
  dueDate?: string | null;
  priorityId?: string | null;
};

// Detailed view of a single task, returned by GET /tasks/{taskId}.
// Mirrors the backend `GetTaskByIdResponse` DTO and is mapped by
// services/tasks/getTaskById.ts. Used by the search screen.
// Date fields arrive as ISO/LocalDateTime strings; UUID fields may
// be absent depending on the task, hence the nullable types.
export type TaskDetail = Task & {
  dueDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  listId: string | null;
  priorityId: string | null;
  priorityName: string | null;
};
