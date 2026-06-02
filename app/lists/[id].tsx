import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";

import CreateNewTaskCard from "@/components/CreateNewTaskCard/CreateNewTaskCard";
import { TaskItem } from "@/components/TaskItem/TaskItem";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { getTasksByListId } from "@/services/tasks/getTasksByListId";
import { updateTask } from "@/services/tasks/updateTask";
import { Task } from "@/types/Task";
import { Pressable, SectionList } from "react-native";

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
  const [error, setError] = useState<string | null>(null);

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

  const handleDeleted = (taskId: string) => {
    // Remove the deleted task locally for an instant update.
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Load on mount and reload whenever this screen regains focus (e.g.
  // returning from the Edit Task screen) so edits show up immediately.
  useFocusEffect(
    useCallback(() => {
      loadTasks();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]),
  );

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const completedCount = completedTasks.length;
  const percentage =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  const sections = [
    ...(pendingTasks.length > 0
      ? [{ title: "ONGOING", data: pendingTasks }]
      : []),
    ...(completedTasks.length > 0
      ? [{ title: "COMPLETED", data: completedTasks }]
      : []),
  ];

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

          <Text className="text-black text-xs mt-2">
            {percentage}% completed
          </Text>
        </Box>

        {/* SUMMARY ROW */}
        <Box className="flex-row justify-between items-center mb-3">
          <Text className="text-sm font-semibold text-gray-600">
            TASKS
          </Text>
          <Box className="bg-gray-200 px-3 py-1 rounded-full">
            <Text className="text-xs">
              {pendingTasks.length} Remaining · {completedCount} Done
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
          <Text className="text-gray-400 mb-4">No tasks in this list yet</Text>
        )}

        {/* SECTIONED LIST */}
        {!loading && !error && (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onToggle={handleToggle}
                onDeleted={handleDeleted}
              />
            )}
            renderSectionHeader={({ section }) => (
              <Box
                className={`flex-row items-center gap-2 mb-2 mt-4 ${
                  section.title === "COMPLETED" ? "mt-6" : ""
                }`}
              >
                {section.title === "COMPLETED" && (
                  <Box className="flex-1 h-px bg-gray-200" />
                )}
                <Text
                  className={`text-xs font-bold tracking-widest ${
                    section.title === "COMPLETED"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {section.title === "COMPLETED"
                    ? `✓ COMPLETED (${completedCount})`
                    : `ONGOING (${pendingTasks.length})`}
                </Text>
                {section.title === "COMPLETED" && (
                  <Box className="flex-1 h-px bg-gray-200" />
                )}
              </Box>
            )}
            ListFooterComponent={
              <CreateNewTaskCard
                listId={id}
                onTaskCreated={loadTasks}
                onError={(msg) => setError(msg || null)}
              />
            }
          />
        )}
      </Box>
    </>
  );
}