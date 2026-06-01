import ModifyTaskCard, {
  ModifyTaskFormData,
} from "@/components/ModifyTaskCard/ModifyTaskCard";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { updateTask } from "@/services/tasks/updateTask";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ModifyTaskScreen() {
  const router = useRouter();
  const { id, title, description, dueDate, priorityId } = useLocalSearchParams<{
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priorityId: string;
  }>();

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: ModifyTaskFormData) => {
    if (!data.title.trim()) {
      setSubmitError("Task title must not be blank");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);
      await updateTask(id, {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        priorityId: data.priorityId,
      });
      router.back();
    } catch (err: any) {
      setSubmitError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <Box className="flex-1 p-4">
        <Box className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold">Edit Task</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: "#2563EB", fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        </Box>

        <ModifyTaskCard
          initialData={{
            title: title ?? "",
            description: description ?? "",
            dueDate: dueDate && dueDate.length > 0 ? dueDate : null,
            priorityId: priorityId && priorityId.length > 0 ? priorityId : null,
          }}
          onSubmit={handleSubmit}
          loading={submitting}
          error={submitError}
        />
      </Box>
    </SafeAreaView>
  );
}
