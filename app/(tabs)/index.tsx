import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, RefreshControl } from "react-native";

import Button from "@/components/Button/Button";
import NewTaskButton from "@/components/NewTaskButton/NewTaskButton";
import TaskListCard from "@/components/TaskListCard/TaskListCard";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/context/AuthContext";
import { logoutFromServer } from "@/services/authService";
import { getLists } from "@/services/tasks/getLists";
import { TaskList } from "@/types/TaskList";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { setIsAuthenticated } = useAuth();
  const router = useRouter();

  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLists = async (fromRefresh: boolean = false) => {
    try {
      setError(null);
      if (fromRefresh) {
        setLoading(true);
      }
      const data = await getLists();
      setLists(data);
      if (fromRefresh) {
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
      setLists([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        setLoading(true);
        await loadLists();
        setLoading(false);
      };
      init();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLists();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logoutFromServer();
    setIsAuthenticated(false);
  };

  const handleListDeleted = (id: string) => {
    setLists((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <SafeAreaView className="flex-1">
      <Box className="flex-1 p-4">

        <Box className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold">Listas de tareas</Text>
          <Button label="Logout" onPress={handleLogout} variant="danger" />
        </Box>

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
            renderItem={({ item }) => <TaskListCard item={item} onDelete={handleListDeleted} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}

        {/* FAB */}
        <NewTaskButton onPress={() => router.push("/create-list")} />
      </Box>
    </SafeAreaView>
  );
}