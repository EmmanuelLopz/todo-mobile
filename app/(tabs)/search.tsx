import { useState } from "react";
import {
  Keyboard,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TaskDetailCard from "@/components/TaskDetailCard/TaskDetailCard";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { getTaskById } from "@/services/tasks/getTaskById";
import { TaskDetail } from "@/types/Task";

export default function SearchScreen() {
  const [taskId, setTaskId] = useState("");
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const trimmed = taskId.trim();
    Keyboard.dismiss();

    if (!trimmed) {
      setError("Please enter a task id to search");
      setTask(null);
      setSearched(true);
      return;
    }

    try {
      setError(null);
      setLoading(true);
      setSearched(true);
      const result = await getTaskById(trimmed);
      setTask(result);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
      setTask(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <Box className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-1">Search Task</Text>
        <Text className="text-sm text-gray-500 mb-4">
          Look up a task by its id.
        </Text>

        {/* Search bar */}
        <Box className="flex-row items-center gap-2 mb-5">
          <TextInput
            value={taskId}
            onChangeText={setTaskId}
            placeholder="Enter task id (UUID)"
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
          <Box className="mt-4">
            <Spinner size="large" color="grey" />
          </Box>
        )}

        {/* Error */}
        {!loading && error && (
          <>
            <Text className="text-red-500 mb-2">{error}</Text>
            <Pressable onPress={handleSearch}>
              <Text className="text-blue-500 underline">Retry</Text>
            </Pressable>
          </>
        )}

        {/* No result */}
        {!loading && !error && searched && !task && (
          <Text className="text-gray-500">No task found for that id.</Text>
        )}

        {/* Initial hint */}
        {!loading && !error && !searched && (
          <Text className="text-gray-400">
            Enter a task id above and tap Search.
          </Text>
        )}

        {/* Result */}
        {!loading && !error && task && <TaskDetailCard task={task} />}
      </Box>
    </SafeAreaView>
  );
}
