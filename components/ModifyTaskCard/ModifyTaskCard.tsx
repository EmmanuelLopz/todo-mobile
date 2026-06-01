import React, { useState } from "react";
import { TextInput } from "react-native";

import Button from "@/components/Button/Button";
import DatePickerField from "@/components/DatePickerField/DatePickerField";
import PriorityPickerField from "@/components/PriorityPickerField/PriorityPickerField";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

export type ModifyTaskFormData = {
  title: string;
  description: string;
  dueDate: string | null;
  priorityId: string | null;
};

type Props = {
  initialData: ModifyTaskFormData;
  onSubmit: (data: ModifyTaskFormData) => void;
  loading?: boolean;
  error?: string | null;
};

const ModifyTaskCard: React.FC<Props> = ({
  initialData,
  onSubmit,
  loading = false,
  error = null,
}) => {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [dueDate, setDueDate] = useState<string | null>(initialData.dueDate);
  const [priorityId, setPriorityId] = useState<string | null>(
    initialData.priorityId
  );

  const handleSubmit = () => {
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priorityId,
    });
  };

  return (
    <Box>
      <Text className="font-semibold mb-1">Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Example: Crear DTOs"
        maxLength={100}
        style={{
          borderWidth: 1,
          borderColor: "#D1D5DB",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          marginBottom: 12,
        }}
      />

      <Text className="font-semibold mb-1">Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Example: Crear request y response DTOs para tasks"
        maxLength={300}
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#D1D5DB",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          minHeight: 80,
          textAlignVertical: "top",
          marginBottom: 16,
        }}
      />

      <DatePickerField
        label="Due Date"
        value={dueDate}
        onChange={setDueDate}
        placeholder="Select due date (optional)"
      />

      <PriorityPickerField
        label="Priority"
        value={priorityId}
        onChange={setPriorityId}
      />

      {error && <Text className="text-red-500 mb-3">{error}</Text>}

      <Button
        label={loading ? "Saving..." : "Save Changes"}
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
      />
    </Box>
  );
};

export default ModifyTaskCard;
