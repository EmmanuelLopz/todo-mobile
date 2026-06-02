import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Box } from "../ui/box";
import { Text } from "../ui/text";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface InfoTileProps {
  icon: IoniconsName;
  label: string;
  value: string;
}

const InfoTile = ({ icon, label, value }: InfoTileProps) => {
  return (
    <Box className="bg-[#f0f2f8] rounded-2xl p-4 flex-1">
      <Ionicons name={icon} size={22} color="#1d4ed8" style={{ marginBottom: 8 }} />
      <Text className="text-gray-500 text-xs font-semibold tracking-widest uppercase mb-1">
        {label}
      </Text>
      <Text className="text-[#1e2235] text-base font-bold leading-5">
        {value}
      </Text>
    </Box>
  );
};

export default InfoTile;
