import { Progress, ProgressFilledTrack } from "../ui/progress";

import { TaskList } from "@/types/TaskList";
import { router } from "expo-router";
import React from "react";
import { Box } from "../ui/box";
import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";

const TaskListCard: React.FC<{ item: TaskList }> = ({ item }) => {
  // estados, useState, variables, constantes

  // funciones
  const handlePress = () => {
    router.push({
      pathname: "/lists/[id]",
      params: {
        id: item.id,
        title: item.title,
      },
    });
  };

  // useEffects

  // render
  return (
    <Pressable
      className="p-4 border border-gray-300 rounded-xl mb-3"
      onPress={handlePress}
    >
      {/* Title */}
      <Text className="text-lg font-semibold">{item.title}</Text>

      {/* Subtitle */}
      <Text className="text-sm text-gray-500 mb-2">{item.subtitle}</Text>

      <Box className="mb-3">
        <Progress value={item.percentage} size="md">
          <ProgressFilledTrack />
        </Progress>
        <Text className="text-xs text-gray-500 mt-1">
          {item.percentage}% complete
        </Text>
      </Box>
    </Pressable>
  );
};

export default TaskListCard;
