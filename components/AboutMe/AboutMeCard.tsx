import React from 'react'
import { Image } from 'react-native'
import { Box } from '../ui/box'
import { Text } from '../ui/text'

const AboutMeCard = () => {
  return (
    <Box className="flex-row items-center gap-3">
      <Image 
        source={require("@/assets/avatar.png")}
        className="w-[20px] h-[20px] rounded-full"
      />
      <Box className="mx-4 mt-4 rounded-2xl bg-[#f2f3fd] p-5 overflow-hidden">
        <Text className="text-2xl font-bold text-blue-700 leading-8">
          ARCHITECT
        </Text>
        <Text className="text-2xl font-bold text-blue-700 leading-8">
          Alex Riveira
        </Text>
      </Box>
    </Box>
    
  )
}

export default AboutMeCard