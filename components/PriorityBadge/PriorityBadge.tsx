import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type Priority = "HIGH" | "MEDIUM" | "LOW";

type Props = {
  priorityName?: string | null;
};

type PriorityConfig = {
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  backgroundColor: string;
  borderColor: string;
};

const PRIORITY_CONFIG: Record<Priority, PriorityConfig> = {
  HIGH: {
    iconName: "warning",
    color: "#B91C1C",
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  MEDIUM: {
    iconName: "remove-circle",
    color: "#B45309",
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  LOW: {
    iconName: "arrow-down-circle",
    color: "#15803D",
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
};

export const normalize = (value?: string | null): Priority | null => {
  if (!value) return null;
  const upper = value.toUpperCase();
  if (upper === "HIGH" || upper === "MEDIUM" || upper === "LOW") return upper;
  return null;
};

const PriorityBadge: React.FC<Props> = ({ priorityName }) => {
  const priority = normalize(priorityName);
  if (!priority) return null;

  const { iconName, color, backgroundColor, borderColor } =
    PRIORITY_CONFIG[priority];

  return (
    <View style={[styles.badge, { backgroundColor, borderColor }]}>
      <Ionicons name={iconName} size={13} color={color} />
      <Text style={[styles.label, { color }]}>
        Priority:{" "}
        <Text style={styles.value}>{priority}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  value: {
    fontWeight: "700",
  },
});

export default PriorityBadge;
