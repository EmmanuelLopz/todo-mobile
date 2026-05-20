import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Image } from "react-native";

export function InfoCard() {
  return (
    <Box className="mx-4 mt-4 rounded-2xl bg-white p-5 overflow-hidden">
      
      {/* Imagen de fondo */}
      <Image
        source={require("@/assets/book.png")} // pon aquí tu imagen
        className="absolute right-0 bottom-20 opacity-10"
        resizeMode="contain"
        style={{ width: 200, height: 200 }}
      />

      {/* Contenido */}
      <Text className="text-2xl font-bold text-blue-700 leading-8">
        Scholarly Atelier
      </Text>

      <Text className="text-lg text-gray-800 leading-8">
        {" "}is a curated educational task management experience designed specifically
        for the React Native ecosystem.
      </Text>

      <Text className="mt-6 text-base text-gray-600 leading-7">
        Unlike traditional productivity tools, this project serves as a foundational
        blueprint for developers to master state management, gesture handling, and
        the "Academic Scholar" design philosophy in mobile interfaces.
      </Text>
      <Box className="flex-row flex-wrap gap-3 mt-6">
        <Box className="px-4 py-2 rounded-full bg-blue-200">
            <Text className="text-blue-900 font-semibold text-sm">
            REACT NATIVE
            </Text>
        </Box>

        <Box className="px-4 py-2 rounded-full bg-blue-200">
            <Text className="text-blue-900 font-semibold text-sm">
            MOBILE UI
            </Text>
        </Box>

        <Box className="px-4 py-2 rounded-full bg-blue-200">
            <Text className="text-blue-900 font-semibold text-sm">
            OPEN SOURCE
            </Text>
        </Box>
      </Box>
    </Box>
  );
}