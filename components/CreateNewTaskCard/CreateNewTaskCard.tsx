import React, { useState } from "react";
import { TextInput } from "react-native";

import Button from "@/components/Button/Button";
import DatePickerField from "@/components/DatePickerField/DatePickerField";
import PriorityPickerField from "@/components/PriorityPickerField/PriorityPickerField";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { createTask } from "@/services/tasks/createTask";

type Props = {
  listId: string;
  onTaskCreated: () => void;
  onError?: (message: string) => void;
};

const CreateNewTaskCard: React.FC<Props> = ({ listId, onTaskCreated, onError }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [priorityId, setPriorityId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      onError?.("Task title must not be blank");
      return;
    }

    try {
      setCreating(true);
      onError?.("");

      await createTask({
        title: title.trim(),
        description: description.trim(),
        listId,
        ...(dueDate ? { dueDate } : {}),
        ...(priorityId ? { priorityId } : {}),
      });

      setTitle("");
      setDescription("");
      setDueDate(null);
      setPriorityId(null);

      onTaskCreated();
    } catch (err: any) {
      onError?.(
        err?.response?.data?.message ??
        err?.response?.data ??
        err?.message ??
        "Could not create task"
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box className="mt-6 mb-8 p-4 rounded-xl border border-gray-200 bg-white">
      <Text className="text-xl font-bold mb-2">Create new task</Text>

      <Text className="text-gray-500 mb-4">
        Add a new task to this active list.
      </Text>

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

      <Button
        label={creating ? "Creating..." : "Create task"}
        onPress={handleCreate}
        disabled={creating}
        loading={creating}
      />
    </Box>
  );
};

export default CreateNewTaskCard;
