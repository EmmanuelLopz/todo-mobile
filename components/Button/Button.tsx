import React from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";

import { Text } from "@/components/ui/text";

type Variant = "primary" | "danger";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
};

const BG_COLOR: Record<Variant, string> = {
  primary: "#2563EB",
  danger:  "#BA1A1A",
};

const Button: React.FC<Props> = ({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={{
        backgroundColor: isDisabled ? "#9CA3AF" : BG_COLOR[variant],
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
      }}
    >
      {loading && (
        <ActivityIndicator
          color="#fff"
          size="small"
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
