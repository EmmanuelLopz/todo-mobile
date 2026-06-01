import DeleteTaskModal from "@/components/DeleteTaskModal/DeleteTaskModal";
import PriorityBadge from "@/components/PriorityBadge/PriorityBadge";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Task } from "@/types/Task";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  /** Called after the task is successfully deleted so the parent can refresh. */
  onDeleted: (id: string) => void;
};

export function TaskItem({ task, onToggle, onDeleted }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleModify = () => {
    router.push({
      pathname: "/modify-task",
      params: {
        id: task.id,
        title: task.title,
        description: task.description,
        ...(task.dueDate ? { dueDate: task.dueDate } : {}),
        ...(task.priorityId ? { priorityId: task.priorityId } : {}),
      },
    });
  };

  const formatDueDate = (date?: string) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    return parsedDate.toLocaleString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <DeleteTaskModal
        visible={deleteModalVisible}
        taskId={task.id}
        onDeleted={(id) => {
          setDeleteModalVisible(false);
          onDeleted(id);
        }}
        onCancel={() => setDeleteModalVisible(false)}
      />
    <Box
      className={`flex-row items-center justify-between p-4 rounded-xl mb-3 ${
        task.completed ? "bg-gray-200" : "bg-white border border-gray-300"
      }`}
      style={{ overflow: "visible", zIndex: menuVisible ? 100 : 1 }}
    >
      {/* LEFT SIDE */}
      <Box className="flex-row items-center flex-1 gap-3">
        {/* Checkbox */}
        <Pressable
          onPress={() => onToggle(task.id)}
          className={`w-6 h-6 rounded-md border items-center justify-center ${
            task.completed ? "bg-green-600 border-green-600" : "border-gray-400"
          }`}
        >
          {task.completed && <Text className="text-white text-xs">✓</Text>}
        </Pressable>

        {/* Text + priority */}
        <Box className="flex-1">
          <Text
            className={`font-semibold ${
              task.completed ? "line-through text-gray-500" : ""
            }`}
          >
            {task.title}
          </Text>

          <Text className="text-sm text-gray-500">{task.description}</Text>
          {task.dueDate && (
            <Text className="text-sm text-gray-500">
              {"Due date: "} {formatDueDate(task.dueDate)}
            </Text>
          )}

          <Box className="mt-1">
            <PriorityBadge priorityName={task.priorityName} />
          </Box>
        </Box>
      </Box>

      {/* RIGHT SIDE — three-dot menu */}
      <View style={{ position: "relative", zIndex: 200, elevation: 200 }}>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            setMenuVisible((v) => !v);
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ paddingHorizontal: 8, paddingVertical: 4 }}
        >
          <Ionicons name="ellipsis-vertical" size={18} color="#6B7280" />
        </TouchableOpacity>

        {menuVisible && (
          <View style={styles.dropdown}>
            {/* Modify Task */}
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                setMenuVisible(false);
                handleModify();
              }}
              style={StyleSheet.flatten([styles.menuItem, styles.menuItemBorder])}
            >
              <Ionicons name="pencil-outline" size={15} color="#2563EB" />
              <Text style={{ ...styles.menuText, color: "#2563EB" }}>
                Modify task
              </Text>
            </TouchableOpacity>

            {/* Delete Task */}
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                setMenuVisible(false);
                setDeleteModalVisible(true);
              }}
              style={styles.menuItem}
            >
              <Ionicons name="trash-outline" size={15} color="#BA1A1A" />
              <Text style={{ ...styles.menuText, color: "#BA1A1A" }}>
                Delete task
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Box>
    </>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    position: "absolute",
    top: 28,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 9999,
    zIndex: 9999,
    minWidth: 155,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
