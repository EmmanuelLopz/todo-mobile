import React from "react";
import { Pressable } from "react-native";

import { Text } from "@/components/ui/text";

type Props = {
  onPress: () => void;
};

const BUTTON_SIZE = 60;
const BUTTON_RADIUS = BUTTON_SIZE / 2;

const NewTaskButton: React.FC<Props> = ({ onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        position: "absolute",
        bottom: 24,
        right: 24,
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_RADIUS,
        backgroundColor: "#2563EB",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 6,
        zIndex: 100,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 28,
          lineHeight: 32,
          fontWeight: "400",
        }}
      >
        +
      </Text>
    </Pressable>
  );
};

export default NewTaskButton;