import React from "react";
import { TouchableOpacity, View } from "react-native";

import { Text } from "@/components/ui/text";

type Props = {
  /** Full hex color with '#' prefix, e.g. "#2563EB" */
  color: string;
  selected: boolean;
  onPress: () => void;
  /** When true, renders the custom palette placeholder instead of a solid color */
  isCustom?: boolean;
};

const ColorSquare: React.FC<Props> = ({
  color,
  selected,
  onPress,
  isCustom = false,
}) => (
  /*
   * Outer TouchableOpacity acts as the selection ring:
   *   - when selected: shows a 3px ring in a semi-transparent version of the color
   *   - when custom:   shows a dashed 1.5px grey border
   *   - otherwise:     fully transparent
   */
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={{
      flex: 1,
      aspectRatio: 1,
      margin: 4,
      borderRadius: 20,
      padding: selected ? 3 : isCustom ? 0 : 0,
      backgroundColor: selected ? color + "40" : "transparent",
    }}
  >
    <View
      style={{
        flex: 1,
        borderRadius: 16,
        backgroundColor: isCustom ? "#EBEBEB" : color,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: isCustom ? 1.5 : 0,
        borderColor: isCustom ? "#C0C0C0" : "transparent",
        borderStyle: isCustom ? "dashed" : "solid",
      }}
    >
      {selected && !isCustom && (
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>
          ✓
        </Text>
      )}

      {isCustom && (
        /* Palette icon — unicode approximation; swap for an icon library if preferred */
        <Text style={{ fontSize: 22 }}>🎨</Text>
      )}
    </View>
  </TouchableOpacity>
);

export default ColorSquare;
