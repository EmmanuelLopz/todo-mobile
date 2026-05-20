import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { TaskItem } from "@/components/TaskItem/TaskItem";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { getTasksByListId } from "@/services/tasks/getTasksByListId";
import { Task } from "@/types/Task";
import { FlatList, Pressable } from "react-native";

type Params = {
  id: string;
  title: string;
};

export default function TasksScreen() {
  // `id` is the listId (a UUID) passed in by TaskListCard when a list
  // is tapped on the index screen.
  const { id, title } = useLocalSearchParams<Params>();

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

  const handleToggle = (taskId: string) => {
    // esto solo es front
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
    // aquí iría la llamada a la API para actualizar el estado del task en el backend
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
        <Box className="bg-blue-600 p-5 rounded-2xl mb-6">
          <Text className="text-white text-xs mb-2">COURSE MODULE</Text>

          <Text className="text-white text-xl font-bold mb-1">{title}</Text>

          <Text className="text-white/80 text-sm mb-4">
            subtitle or description goes here
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
          />
        )}
      </Box>
    </>
  );
}
