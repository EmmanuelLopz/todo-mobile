import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { useState } from "react";
import { TaskItem } from "./TaskItem";

const InteractiveWrapper = (args: React.ComponentProps<typeof TaskItem>) => {
  const [task, setTask] = useState(args.task);

  const handleToggle = () => {
    setTask((prev) => ({ ...prev, completed: !prev.completed }));
    args.onToggle(task.id);
  };

  return <TaskItem task={task} onToggle={handleToggle} onMenu={args.onMenu} />;
};

const meta: Meta<typeof TaskItem> = {
  title: "Components/TaskItem",
  component: TaskItem,
  tags: ["autodocs"],
  args: {
    onToggle: () => {},  // 👈 sin @storybook/test
    onMenu: () => {},    // 👈 sin @storybook/test
  },
  argTypes: {
    task: { control: "object" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
// ... el resto igual