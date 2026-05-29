import React, { useState } from "react";
import { TextInput } from "react-native";

import Button from "@/components/Button/Button";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Color } from "@/types/Color";
import ColorPicker from "./ColorPicker";

// ---------------------------------------------------------------------------
// Default preset colors shown while the /colors endpoint isn't wired up yet.
// Replace this array (or pass `colors` as a prop) once the endpoint is ready.
// ---------------------------------------------------------------------------
const DEFAULT_COLORS: Color[] = [
  { id: "1", name: "Primary Blue",  hexValue: "2563EB" },
  { id: "2", name: "Slate",         hexValue: "4B5568" },
  { id: "3", name: "Forest Green",  hexValue: "166534" },
  { id: "4", name: "Purple",        hexValue: "7C3AED" },
  { id: "5", name: "Coral Red",     hexValue: "EF4444" },
  { id: "6", name: "Amber",         hexValue: "F59E0B" },
  { id: "7", name: "Teal",          hexValue: "10B981" },
];

export type CreateListFormData = {
  title: string;
  description: string;
  colorId: string;
};

type Props = {
  onSubmit: (data: CreateListFormData) => void;
  loading?: boolean;
  error?: string | null;
  /** Pass the backend color list here once the endpoint is wired up. */
  colors?: Color[];
};

const CreateListCard: React.FC<Props> = ({
  onSubmit,
  loading = false,
  error = null,
  colors = DEFAULT_COLORS,
}) => {
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [selectedColorId, setSelectedColorId] = useState<string>(
    colors[0]?.id ?? ""
  );

  const handleSubmit = () => {
    onSubmit({ title, description, colorId: selectedColorId });
  };

  return (
    <Box>
      {/* Title */}
      <Text className="font-semibold mb-1">Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Example: Desarrollo de Software"
        maxLength={100}
        style={{
          borderWidth: 1,
          borderColor: "#D1D5DB",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          marginBottom: 16,
        }}
      />

      {/* Description */}
      <Text className="font-semibold mb-1">Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Example: Backend, frontend and clean architecture tasks"
        maxLength={300}
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#D1D5DB",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          minHeight: 100,
          textAlignVertical: "top",
          marginBottom: 20,
        }}
      />

      {/* Color picker */}
      <Box className="mb-6">
        <ColorPicker
          colors={colors}
          selectedId={selectedColorId}
          onSelect={setSelectedColorId}
        />
      </Box>

      {/* Inline error */}
      {error && (
        <Text className="text-red-500 mb-3">{error}</Text>
      )}

      {/* Submit */}
      <Button
        label="Create List"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
      />
    </Box>
  );
};

export default CreateListCard;
