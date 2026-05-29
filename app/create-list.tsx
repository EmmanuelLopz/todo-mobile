import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";

import CreateListCard, {
  CreateListFormData,
} from "@/components/CreateListCard/CreateListCard";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/useColors";
import { getUserIdFromToken } from "@/services/authService";
import { createList } from "@/services/lists/createList";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateListScreen() {
  const router = useRouter();
  const { colors, loading: colorsLoading, error: colorsError } = useColors();

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateListFormData) => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      const userId = await getUserIdFromToken();
      if (!userId) {
        setSubmitError("Session expired. Please log in again.");
        return;
      }

      await createList({
        title: data.title,
        description: data.description,
        colorId: data.colorId,
        userId,
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

        {/* Header */}
        <Box className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold">New List</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: "#2563EB", fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        </Box>

        {colorsLoading ? (
          <ActivityIndicator size="large" color="#2563EB" />
        ) : (
          <CreateListCard
            onSubmit={handleSubmit}
            colors={colors.length > 0 ? colors : undefined}
            loading={submitting}
            error={submitError ?? colorsError}
          />
        )}

      </Box>
    </SafeAreaView>
  );
}
