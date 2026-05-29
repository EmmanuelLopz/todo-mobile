import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { TaskDetail } from "@/types/Task";
import React from "react";

// Format an ISO / LocalDateTime string into a readable date.
// Returns a dash when the value is missing and the raw value when it
// cannot be parsed, so the UI never shows "Invalid Date".
const formatDate = (value: string | null): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const TaskDetailCard: React.FC<{ task: TaskDetail }> = ({ task }) => {
  return (
    <Box className="p-5 border border-gray-300 rounded-2xl bg-white">
      {/* Header: title + status badge */}
      <Box className="flex-row items-start justify-between mb-2">
        <Text className="text-lg font-bold flex-1 pr-3">{task.title}</Text>

        <Box
          className={`px-3 py-1 rounded-full ${
            task.completed ? "bg-green-100" : "bg-amber-100"
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              task.completed ? "text-green-700" : "text-amber-700"
            }`}
          >
            {task.completed ? "Completed" : "Pending"}
          </Text>
        </Box>
      </Box>

      {/* Description */}
      {task.description ? (
        <Text className="text-sm text-gray-600 mb-4">{task.description}</Text>
      ) : null}

      {/* Priority */}
      {task.priorityName ? (
        <Box className="flex-row items-center mb-4">
          <Text className="text-xs font-semibold text-gray-500 mr-2">
            PRIORITY
          </Text>
          <Box className="bg-blue-100 px-3 py-1 rounded-full">
            <Text className="text-xs font-semibold text-blue-700">
              {task.priorityName}
            </Text>
          </Box>
        </Box>
      ) : null}

      {/* Meta rows */}
      <Box className="border-t border-gray-200 pt-3">
        <Box className="flex-row justify-between mb-1">
          <Text className="text-xs text-gray-500">Due date</Text>
          <Text className="text-xs text-gray-700">
            {formatDate(task.dueDate)}
          </Text>
        </Box>
        <Box className="flex-row justify-between mb-1">
          <Text className="text-xs text-gray-500">Created</Text>
          <Text className="text-xs text-gray-700">
            {formatDate(task.createdAt)}
          </Text>
        </Box>
        <Box className="flex-row justify-between">
          <Text className="text-xs text-gray-500">Updated</Text>
          <Text className="text-xs text-gray-700">
            {formatDate(task.updatedAt)}
          </Text>
        </Box>
      </Box>

      {/* Task id footer */}
      <Box className="mt-3">
        <Text className="text-[10px] text-gray-400">ID: {task.id}</Text>
      </Box>
    </Box>
  );
};

export default TaskDetailCard;
