import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, View } from "react-native";
import { Box } from "../ui/box";
import { Text } from "../ui/text";

const ProfileCard = () => {
  return (
    <Box className="bg-white rounded-2xl px-5 py-4 flex-row items-center">
      <Box className="relative">
        <Image
          source={require("@/assets/emmanuel.png")}
          style={{ width: 72, height: 72, borderRadius: 36 }}
        />
        {/* Online indicator */}
        <View
          style={{
            position: "absolute",
            bottom: 2,
            right: 2,
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: "#22c55e",
            borderWidth: 2,
            borderColor: "#fff",
          }}
        />
      </Box>

      <Box className="ml-4 flex-1">
        <Box className="flex-row items-center gap-1 mb-1">
          <Ionicons name="construct-outline" size={12} color="#1d4ed8" />
          <Text className="text-blue-700 text-xs font-bold tracking-widest uppercase">
            Software Engineer
          </Text>
        </Box>
        <Text className="text-[#1e2235] text-2xl font-bold">Emmanuel Lopez</Text>
      </Box>
    </Box>
  );
};

export default ProfileCard;
