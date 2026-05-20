import { TaskList } from "@/types/TaskList";
import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Box } from "../ui/box";
import { Pressable } from "../ui/pressable";
import { Progress, ProgressFilledTrack } from "../ui/progress";
import { Text } from "../ui/text";

const TaskListCardStory: React.FC<{ item: TaskList }> = ({ item }) => (
  <Pressable
    className="p-4 border border-gray-300 rounded-xl mb-3"
    onPress={() => console.log("pressed", item.id)}
  >
    <Text className="text-lg font-semibold">{item.title}</Text>
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

const meta: Meta<typeof TaskListCardStory> = {
  title: "Components/TaskListCard",
  component: TaskListCardStory,
  tags: ["autodocs"],
  argTypes: {
    item: { control: "object" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item: {
      id: "1",
      title: "Lista de compras",
      subtitle: "Súper del fin de semana",
      percentage: 40,
      tags: ["personal", "hogar"],
      idColor: "blue",
      idIcon: "cart",
    },
  },
};

export const Completada: Story = {
  name: "Completada (100%)",
  args: {
    item: {
      id: "2",
      title: "Proyecto final",
      subtitle: "Entrega exitosa 🎉",
      percentage: 100,
      tags: ["trabajo", "urgente"],
      idColor: "green",
      idIcon: "check",
    },
  },
};

export const Vacia: Story = {
  name: "Vacía (0%)",
  args: {
    item: {
      id: "3",
      title: "Pendientes de trabajo",
      subtitle: "Sin tareas completadas aún",
      percentage: 0,
      tags: ["trabajo"],
      idColor: "gray",
      idIcon: "list",
    },
  },
};

export const CasiCompleta: Story = {
  name: "Casi completa (80%)",
  args: {
    item: {
      id: "4",
      title: "Preparación del viaje",
      subtitle: "Faltan solo unas cosas",
      percentage: 80,
      tags: ["personal", "viaje"],
      idColor: "orange",
      idIcon: "airplane",
    },
  },
};