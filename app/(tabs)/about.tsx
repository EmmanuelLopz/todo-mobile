import AboutMeCard from '@/components/AboutMe/AboutMeCard';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { Box } from '@/components/ui/box';
import { Text } from "@/components/ui/text";
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const AboutScreen = () => {
  return (
    <SafeAreaView>
        <ScrollView>
          <Box className="flex-row items-center gap-3 mx-4 mt-6">
            {/* Línea azul */}
            <Box className="w-2 h-8 bg-blue-700 rounded-full" />

            {/* Texto */}
            <Text className="text-2xl font-semibold text-gray-700">
              About the Project
            </Text>
          </Box>
          <InfoCard />
          <Box className="flex-row items-center gap-3 mx-4 mt-6">
            {/* Línea azul */}
            <Box className="w-2 h-8 bg-blue-700 rounded-full" />

            {/* Texto */}
            <Text className="text-2xl font-semibold text-gray-700">
              About Me
            </Text>
          </Box>
          <AboutMeCard />
        </ScrollView>
    </SafeAreaView>
  )
}

export default AboutScreen