import React from "react";
import { View } from "react-native";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Color } from "@/types/Color";
import ColorSquare from "./ColorSquare";

type Props = {
  colors: Color[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

/** Splits an array into consecutive chunks of `size`. */
function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

const CUSTOM_ID = "__custom__";

const ColorPicker: React.FC<Props> = ({ colors, selectedId, onSelect }) => {
  const selected = colors.find((c) => c.id === selectedId);

  // Append the custom placeholder to the list before chunking
  const allItems: Array<Color | { id: string; isCustom: true }> = [
    ...colors,
    { id: CUSTOM_ID, isCustom: true },
  ];

  const rows = chunk(allItems, 4);

  return (
    <Box>
      {/* Section header + selected color badge */}
      <Box
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontWeight: "700",
            fontSize: 12,
            letterSpacing: 1.2,
            color: "#374151",
          }}
        >
          ACCENT COLOR
        </Text>

        {selected && (
          <View
            style={{
              backgroundColor: "#EEF2FF",
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 20,
            }}
          >
            <Text
              style={{ color: "#2563EB", fontWeight: "700", fontSize: 11 }}
            >
              {selected.name.toUpperCase()}
            </Text>
          </View>
        )}
      </Box>

      {/* Color rows — each row holds up to 4 squares */}
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={{ flexDirection: "row", marginBottom: 4 }}
        >
          {row.map((item) => {
            const isCustom = "isCustom" in item && item.isCustom;
            const color = isCustom
              ? "#EBEBEB"
              : `#${"hexValue" in item ? item.hexValue : ""}`;

            return (
              <ColorSquare
                key={item.id}
                color={color}
                selected={item.id === selectedId}
                onPress={() => onSelect(item.id)}
                isCustom={isCustom}
              />
            );
          })}

          {/* Pad the last row with invisible spacers so squares stay the right size */}
          {row.length < 4 &&
            Array.from({ length: 4 - row.length }).map((_, i) => (
              <View key={`spacer-${i}`} style={{ flex: 1, margin: 4 }} />
            ))}
        </View>
      ))}
    </Box>
  );
};

export default ColorPicker;
