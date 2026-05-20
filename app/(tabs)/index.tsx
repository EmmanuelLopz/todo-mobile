import { useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl } from "react-native";

import TaskListCard from "@/components/TaskListCard/TaskListCard";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { TaskList } from "@/types/TaskList";
import { SafeAreaView } from "react-native-safe-area-context";

const API_BASE_URL = "http://localhost:8080";

const COLOR_MAP: Record<number, string> = {
  1: "bg-blue-500",
  2: "bg-green-500",
  3: "bg-purple-500",
  4: "bg-red-500",
  5: "bg-yellow-500",
};

const mapToTaskList = (item: any): TaskList => ({
  id: String(item.id),
  title: item.title,
  subtitle: item.description ?? "",
  percentage:
    item.totalTodos > 0
      ? Math.round((item.completedTodos / item.totalTodos) * 100)
      : 0,
  tags: [],
  idColor: COLOR_MAP[item.colorId] ?? "bg-blue-500",
  idIcon: "list",
});

export default function HomeScreen() {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskLists = async (): Promise<TaskList[]> => {
    const response = await fetch(`${API_BASE_URL}/lists`);
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const data = await response.json();
    return data.map(mapToTaskList);
  };

  const loadLists = async (fromRefresh: boolean = false) => {
    try {
      setError(null);
      if (fromRefresh) {
        setLoading(true);
      }
      const data = await fetchTaskLists();
      setLists(data);
      if (fromRefresh) {
        setLoading(false);
      }
    } catch (err) {
      setError("Something went wrong");
      setLists([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadLists();
      setLoading(false);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); {/* Se pone arreglo vacío para que se ejecute una sola vez */}

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLists();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1">
      <Box className="flex-1 p-4">
        <Text className="text-2xl mb-4">Task Lists</Text>

        {/* Loading */}
        {loading && (
          <Box className="mt-4">
            <Spinner size="large" color="grey" />
          </Box>
        )}

        {/* Error */}
        {!loading && error && (
          <>
            <Text className="text-red-500 mb-2">{error}</Text>
            <Pressable onPress={() => loadLists(true)}>
              <Text className="text-blue-500 underline">Retry</Text>
            </Pressable>
          </>
        )}

        {/* Empty */}
        {!loading && !error && lists.length === 0 && (
          <Text>No tasks available</Text>
        )}

        {/* List */}
        {!loading && !error && (
          <FlatList
            data={lists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TaskListCard item={item} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </Box>
    </SafeAreaView>
  );
}