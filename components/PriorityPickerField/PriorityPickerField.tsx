import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import getPriorities from "@/services/priorities/getPriorities";
import { Priority } from "@/types/Priority";

// ─── visual config ────────────────────────────────────────────────────────────
// Maps a normalised priority name to display config.
// Names coming from the backend are case-insensitive (HIGH / High / high).

type PriorityLevel = "HIGH" | "MEDIUM" | "LOW";

type VisualConfig = {
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  backgroundColor: string;
  borderColor: string;
  description: string;
};

const VISUAL: Record<PriorityLevel, VisualConfig> = {
  HIGH: {
    iconName: "warning",
    color: "#B91C1C",
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    description: "Must be done urgently",
  },
  MEDIUM: {
    iconName: "remove-circle",
    color: "#B45309",
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
    description: "Important, but not critical",
  },
  LOW: {
    iconName: "arrow-down-circle",
    color: "#15803D",
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
    description: "Can be done whenever",
  },
};

const FALLBACK: VisualConfig = {
  iconName: "flag-outline",
  color: "#6B7280",
  backgroundColor: "#F9FAFB",
  borderColor: "#E5E7EB",
  description: "",
};

function visualFor(name: string): VisualConfig {
  const key = name.toUpperCase() as PriorityLevel;
  return VISUAL[key] ?? FALLBACK;
}

// ─── PriorityPickerField ──────────────────────────────────────────────────────

type Props = {
  /** Currently selected priorityId (UUID string from the DB). */
  value: string | null;
  onChange: (id: string | null) => void;
  label?: string;
};

export default function PriorityPickerField({ value, onChange, label }: Props) {
  const [open, setOpen] = useState(false);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    getPriorities()
      .then(setPriorities)
      .catch((e) => setFetchError(e.message ?? "Could not load priorities"))
      .finally(() => setLoading(false));
  }, []);

  const selected = priorities.find((p) => p.id === value) ?? null;

  const handleSelect = (p: Priority) => {
    onChange(p.id);
    setOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setOpen(false);
  };

  return (
    <>
      {label && <Text style={styles.fieldLabel}>{label}</Text>}

      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={styles.trigger}
        activeOpacity={0.7}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#9CA3AF" style={{ marginRight: 4 }} />
        ) : selected ? (
          <Ionicons
            name={visualFor(selected.name).iconName}
            size={16}
            color={visualFor(selected.name).color}
          />
        ) : (
          <Ionicons name="flag-outline" size={16} color="#9CA3AF" />
        )}

        <Text
          style={[
            styles.triggerText,
            selected
              ? { color: visualFor(selected.name).color, fontWeight: "600" }
              : styles.triggerPlaceholder,
          ]}
        >
          {loading
            ? "Loading…"
            : selected
            ? selected.name.toUpperCase()
            : "Select priority"}
        </Text>

        <View style={styles.triggerRight}>
          {selected && (
            <TouchableOpacity
              onPress={() => onChange(null)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          <Ionicons name="chevron-down" size={14} color="#9CA3AF" />
        </View>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />

        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <TouchableOpacity
              onPress={handleClear}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.headerClear}>Clear</Text>
            </TouchableOpacity>
            <Text style={styles.sheetTitle}>Priority</Text>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.optionsList}>
            {fetchError ? (
              <Text style={styles.errorText}>{fetchError}</Text>
            ) : priorities.length === 0 ? (
              <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 24 }} />
            ) : (
              priorities.map((p) => {
                const v = visualFor(p.name);
                const isSelected = value === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => handleSelect(p)}
                    activeOpacity={0.75}
                    style={[
                      styles.optionRow,
                      isSelected && { backgroundColor: v.backgroundColor },
                    ]}
                  >
                    <View style={[styles.iconPill, { backgroundColor: v.backgroundColor, borderColor: v.borderColor }]}>
                      <Ionicons name={v.iconName} size={18} color={v.color} />
                    </View>

                    <View style={styles.optionText}>
                      <Text style={[styles.optionName, { color: v.color }]}>
                        {p.name.toUpperCase()}
                      </Text>
                      {v.description ? (
                        <Text style={styles.optionDesc}>{v.description}</Text>
                      ) : null}
                    </View>

                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color={v.color} />
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  triggerText: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },
  triggerPlaceholder: {
    color: "#9CA3AF",
    fontWeight: "400",
  },
  triggerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  headerClear: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  optionsList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 4,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
  },
  iconPill: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionName: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  optionDesc: {
    fontSize: 12,
    color: "#6B7280",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    textAlign: "center",
    marginVertical: 16,
  },
});
