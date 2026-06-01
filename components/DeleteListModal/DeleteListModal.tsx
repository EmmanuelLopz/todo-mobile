import Button from "@/components/Button/Button";
import { Text } from "@/components/ui/text";
import { deleteList } from "@/services/lists/deleteList";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  listId: string;
  onDeleted: (id: string) => void;
  onCancel: () => void;
};

const DeleteListModal: React.FC<Props> = ({ visible, listId, onDeleted, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      await deleteList(listId);
      onDeleted(listId);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        setError("List not found. It may have already been deleted.");
      } else if (status === 401 || status === 403) {
        setError("You don't have permission to delete this list.");
      } else if (!err.response) {
        setError("Cannot reach the server. Check your connection.");
      } else {
        setError(err?.response?.data?.message ?? err?.message ?? "Failed to delete. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    onCancel();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handleCancel}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" }}
        activeOpacity={1}
        onPress={handleCancel}
      >
        {/* Card — stop propagation so tapping inside doesn't close */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 28,
            width: "65%",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Icon circle */}
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 32,
              backgroundColor: "#FEE2E2",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Ionicons name="trash-outline" size={28} color="#BA1A1A" />
          </View>

          <Text style={{ fontSize: 20, fontWeight: "700", color: "#111827", textAlign: "center" }}>
            Delete List?
          </Text>

          <Text style={{ fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 1.5, marginBottom: 8 }}>
            Are you sure you want to delete this list? This action cannot be undone and will remove all tasks inside.
          </Text>

          {error && (
            <Text style={{ fontSize: 13, color: "#BA1A1A", textAlign: "center" }}>{error}</Text>
          )}

          <View style={{ width: "75%", gap: 5 }}>
            <Button label="Delete List" variant="danger" onPress={handleConfirm} loading={loading} disabled={loading} />
            <Button label="Cancel" variant="primary" onPress={handleCancel} disabled={loading} />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default DeleteListModal;
