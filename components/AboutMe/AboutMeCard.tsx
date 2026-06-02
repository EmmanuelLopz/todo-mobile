import React from "react";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import InfoTile from "./InfoTile";
import ProfileCard from "./ProfileCard";

const AboutMeCard = () => {
  return (
    <Box className="mx-4 mt-4 gap-3">
      {/* Profile header */}
      <ProfileCard />

      {/* Info tiles row */}
      <Box className="flex-row gap-3">
        <InfoTile
          icon="hardware-chip-outline"
          label="CS Interest"
          value="Distributed Systems"
        />
        <InfoTile
          icon="color-palette-outline"
          label="Hobbies"
          value="Frontend development"
        />
      </Box>

      {/* Quote */}
      <Box className="bg-white rounded-2xl px-5 py-4">
        <Text className="text-gray-600 text-base leading-6 italic">
          "Dedicated to bridging the gap between high-fidelity design systems
          and functional code architecture."
        </Text>
      </Box>
    </Box>
  );
};

export default AboutMeCard;
