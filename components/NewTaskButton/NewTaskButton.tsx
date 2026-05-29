import React from "react";
import { TouchableOpacity } from "react-native";

import { Text } from "@/components/ui/text";

type Props = {
  onPress: () => void;
};

const NewTaskButton: React.FC<Props> = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      position: "absolute",
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "#2563EB",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 6,
    }}
  >
    <Text style={{ color: "#fff", fontSize: 28, lineHeight: 32, fontWeight: "400" }}>+</Text>
  </TouchableOpacity>
);

export default NewTaskButton;
