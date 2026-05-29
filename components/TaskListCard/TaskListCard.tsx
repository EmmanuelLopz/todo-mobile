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
        description: item.subtitle,
        color: item.color,
      },
    });
  };

  // useEffects

  // render
  return (
    <Pressable
      className="flex-row border border-gray-300 rounded-xl mb-3 overflow-hidden"
      onPress={handlePress}
    >
      {/* Barra lateral completa — color driven by the list's color from the backend */}
      <Box style={{ width: 8, backgroundColor: item.color }} />

      {/* Contenido */}
      <Box className="flex-1 p-4">
        <Text className="text-lg font-semibold mb-1">
          {item.title}
        </Text>

        <Text className="text-sm text-gray-500 mb-2">
          {item.subtitle}
        </Text>

        <Box className="mb-3">
          <Progress value={item.percentage} size="md">
            <ProgressFilledTrack style={{ backgroundColor: item.color }} />
          </Progress>

          <Text className="text-xs text-gray-500 mt-1">
            {item.percentage}% complete
          </Text>
        </Box>
      </Box>
    </Pressable>
  );
};

export default TaskListCard;
