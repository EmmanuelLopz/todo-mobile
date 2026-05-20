import { useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, TouchableOpacity } from "react-native";

import TaskListCard from "@/components/TaskListCard/TaskListCard";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/services/authService";
import { getLists } from "@/services/tasks/getLists";
import { TaskList } from "@/types/TaskList";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { setIsAuthenticated } = useAuth();
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

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadLists();
      setLoading(false);
    };

    init();
  
  }, []); 

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLists();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
  };

  return (
    <SafeAreaView className="flex-1">
      <Box className="flex-1 p-4">

        <Box className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold">Task Lists</Text>
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: '#BA1A1A',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text className="text-white font-bold text-sm">Logout</Text>
          </TouchableOpacity>
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
