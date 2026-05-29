import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { TaskItem } from "@/components/TaskItem/TaskItem";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { createTask } from "@/services/tasks/createTask";
import { getTasksByListId } from "@/services/tasks/getTasksByListId";
import { updateTask } from "@/services/tasks/updateTask";
import { Task } from "@/types/Task";
import { FlatList, Pressable, TextInput, TouchableOpacity } from "react-native";

type Params = {
  id: string;
  title: string;
  description?: string;
  color?: string;
};

export default function TasksScreen() {
  // `id` is the listId (a UUID) passed in by TaskListCard when a list
  // is tapped on the index screen.
  const { id, title, description, color } = useLocalSearchParams<Params>();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingTask, setCreatingTask] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  const loadTasks = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getTasksByListId(id);
      setTasks(data);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) {
      setError("Task title must not be blank");
      return;
    }

    try {
      setCreatingTask(true);
      setError(null);

      await createTask({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
        listId: id,
      });

      setNewTaskTitle("");
      setNewTaskDescription("");

      await loadTasks();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
        err?.response?.data ??
        err?.message ??
        "Could not create task"
      );
    } finally {
      setCreatingTask(false);
    }
  };

  const handleToggle = async (taskId: string) => {
    // Find the task to get its current state
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = !task.completed;

    // Update local state optimistically
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: newStatus } : t,
      ),
    );

    // Persist to backend
    try {
      await updateTask(taskId, {
        status: newStatus,
      });
    } catch (err: any) {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, completed: task.completed } : t,
        ),
      );
      setError(err?.message ?? "Failed to update task");
    }
  };

  const handleMenu = (taskId: string) => {
    console.log("Open menu for task:", taskId);
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const percentage =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <>
      <Stack.Screen
        options={{
          title: title,
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <Box className="flex-1 p-4">
        {/* HEADER CARD */}
        <Box
          className="p-5 rounded-2xl mb-6"
          style={{ backgroundColor: color || '#3b82f6' }}
        >
          <Text className="text-white text-xs mb-2">COURSE MODULE</Text>

          <Text className="text-white text-xl font-bold mb-1">{title}</Text>

          <Text className="text-white/80 text-sm mb-4">
            {description && description.length > 0
              ? description
              : 'No description provided'}
          </Text>

          <Progress value={percentage}>
            <ProgressFilledTrack />
          </Progress>

          <Text className="text-white text-xs mt-2">
            {percentage}% completed
          </Text>
        </Box>

        {/* SECTION HEADER */}
        <Box className="flex-row justify-between items-center mb-3">
          <Text className="text-sm font-semibold text-gray-600">
            ONGOING TASKS
          </Text>

          <Box className="bg-gray-200 px-3 py-1 rounded-full">
            <Text className="text-xs">
              {tasks.length - completedCount} Items Remaining
            </Text>
          </Box>
        </Box>

        {/* LOADING */}
        {loading && <Spinner size="large" color="grey" />}

        {/* ERROR */}
        {!loading && error && (
          <>
            <Text className="text-red-500 mb-2">{error}</Text>
            <Pressable onPress={loadTasks}>
              <Text className="text-blue-500 underline">Retry</Text>
            </Pressable>
          </>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && tasks.length === 0 && (
          <Text>No tasks in this list yet</Text>
        )}

        {/* LIST */}
        {!loading && !error && (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onToggle={handleToggle}
                onMenu={handleMenu}
              />
            )}
            ListFooterComponent={
              <Box className="mt-6 mb-8 p-4 rounded-xl border border-gray-200 bg-white">
                <Text className="text-xl font-bold mb-2">Create new task</Text>

                <Text className="text-gray-500 mb-4">
                  Add a new task to this active list.
                </Text>

                <Text className="font-semibold mb-1">Title</Text>
                <TextInput
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                  placeholder="Example: Crear DTOs"
                  maxLength={100}
                  style={{
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    marginBottom: 12,
                  }}
                />

                <Text className="font-semibold mb-1">Description</Text>
                <TextInput
                  value={newTaskDescription}
                  onChangeText={setNewTaskDescription}
                  placeholder="Example: Crear request y response DTOs para tasks"
                  maxLength={300}
                  multiline
                  style={{
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    minHeight: 80,
                    textAlignVertical: "top",
                    marginBottom: 16,
                  }}
                />

                <TouchableOpacity
                  onPress={handleCreateTask}
                  disabled={creatingTask}
                  style={{
                    backgroundColor: creatingTask ? "#9CA3AF" : "#2563EB",
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                >
                  <Text className="text-white font-bold">
                    {creatingTask ? "Creating..." : "Create task"}
                  </Text>
                </TouchableOpacity>
              </Box>
            }
          />
        )}
      </Box>
    </>
  );
}