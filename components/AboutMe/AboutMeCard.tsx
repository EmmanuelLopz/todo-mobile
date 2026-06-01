import React from "react";
import { Image } from "react-native";
import { Box } from "../ui/box";
import { Text } from "../ui/text";

const AboutMeCard = () => {
  return (
    <Box className="w-full rounded-2xl bg-white px-8 py-8 flex-row items-center">
      <Image
        source={require("@/assets/avatar.png")}
        className="w-[24px] h-[24px] rounded-full"
      />

      <Box className="ml-8">
        <Text className="text-blue-700 text-lg font-bold tracking-[6px] uppercase">
          Architect
        </Text>

        <Text className="text-[#2d2f3a] text-3xl font-bold mt-2">
          Alex Riveira
        </Text>
      </Box>
    </Box>
  );
};

export default AboutMeCard;