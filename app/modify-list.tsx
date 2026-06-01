import ModifyListCard, {
  ModifyListFormData,
} from "@/components/ModifyListCard/ModifyListCard";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/useColors";
import { updateList } from "@/services/lists/updateList";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ModifyListScreen() {
  const router = useRouter();
  const { id, title, description, colorId } = useLocalSearchParams<{
    id: string;
    title: string;
    description: string;
    colorId: string;
  }>();

  const { colors, loading: colorsLoading, error: colorsError } = useColors();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: ModifyListFormData) => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      await updateList(id, {
        title: data.title,
        description: data.description,
        colorId: data.colorId,
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
          <Text className="text-2xl font-bold">Edit List</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: "#2563EB", fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        </Box>

        {colorsLoading ? (
          <ActivityIndicator size="large" color="#2563EB" />
        ) : (
          <ModifyListCard
            initialData={{
              title: title ?? "",
              description: description ?? "",
              colorId: colorId ?? "",
            }}
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
