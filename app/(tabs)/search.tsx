import { useState } from "react";
import {
  FlatList,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native";

import { TaskItem } from "@/components/TaskItem/TaskItem";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { searchTasksByTitle } from "@/services/tasks/searchTasksByTitle";
import { Task } from "@/types/Task";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const trimmed = query.trim();
    Keyboard.dismiss();

    if (!trimmed) {
      setError("Please enter a title to search");
      setTasks([]);
      setSearched(true);
      return;
    }

    try {
      setError(null);
      setLoading(true);
      setSearched(true);
      const results = await searchTasksByTitle(trimmed);
      setTasks(results);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <Box className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-1">Search Tasks</Text>
        <Text className="text-sm text-gray-500 mb-4">
          Enter the starting letters of a task title and press Search.
        </Text>

        {/* Search bar */}
        <Box className="flex-row items-center gap-2 mb-5">
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="e.g. Read"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-base"
          />
          <TouchableOpacity
            onPress={handleSearch}
            disabled={loading}
            style={{
              backgroundColor: loading ? "#93C5FD" : "#2563EB",
              paddingHorizontal: 20,
              paddingVertical: 13,
              borderRadius: 12,
            }}
          >
            <Text className="text-white font-bold text-sm">Search</Text>
          </TouchableOpacity>
        </Box>

        {/* Loading */}
        {loading && (
          <Box className="mt-4 items-center">
            <Spinner size="large" color="grey" />
          </Box>
        )}

        {/* Error */}
        {!loading && error && (
          <Text className="text-red-500">{error}</Text>
        )}

        {/* No results */}
        {!loading && !error && searched && tasks.length === 0 && (
          <Text className="text-gray-500">No tasks found for "{query}".</Text>
        )}

        {/* Initial hint */}
        {!loading && !error && !searched && (
          <Text className="text-gray-400">
            Enter a title above and tap Search.
          </Text>
        )}

        {/* Results */}
        {!loading && !error && tasks.length > 0 && (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onToggle={() => {}}
                onDeleted={() => {}}
              />
            )}
            ItemSeparatorComponent={() => <Box className="h-2" />}
          />
        )}
      </Box>
    </SafeAreaView>
  );
}
