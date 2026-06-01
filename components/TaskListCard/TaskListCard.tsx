import { Progress, ProgressFilledTrack } from "../ui/progress";

import { TaskList } from "@/types/TaskList";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import DeleteListModal from "../DeleteListModal/DeleteListModal";
import { Box } from "../ui/box";
import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";

type Props = {
  item: TaskList;
  onDelete?: (id: string) => void;
};

const TaskListCard: React.FC<Props> = ({ item, onDelete }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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

  const handleCardPress = () => {
    if (menuVisible) {
      setMenuVisible(false);
      return;
    }

    handlePress();
  };

  return (
    <>
      <Pressable
        className="border border-gray-300 rounded-xl mb-3 bg-white"
        onPress={handleCardPress}
        style={{
          position: "relative",
          overflow: "visible",
          zIndex: menuVisible ? 1000 : 1,
          elevation: menuVisible ? 12 : 1,
        }}
      >
        {/* Barra lateral completa */}
        <Box
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            backgroundColor: item.color,
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
          }}
        />

        {/* Contenido */}
        <Box
          className="p-4"
          style={{
            paddingLeft: 20,
            overflow: "visible",
          }}
        >
          {/* Title row with three-dot menu */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              position: "relative",
              zIndex: 1000,
              elevation: 1000,
            }}
          >
            <Text
              className="text-lg font-semibold mb-1"
              style={{
                flex: 1,
                paddingRight: 12,
              }}
            >
              {item.title}
            </Text>

            {/* Three-dot button */}
            <View
              style={{
                position: "relative",
                zIndex: 2000,
                elevation: 2000,
              }}
            >
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  setMenuVisible((value) => !value);
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={{
                  paddingLeft: 8,
                  paddingVertical: 2,
                }}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={18}
                  color="#6B7280"
                />
              </TouchableOpacity>

              {/* Dropdown menu */}
              {menuVisible && (
                <View
                  style={{
                    position: "absolute",
                    top: 28,
                    right: 0,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.12,
                    shadowRadius: 6,
                    elevation: 9999,
                    zIndex: 9999,
                    minWidth: 150,
                  }}
                >
                  {/* Modify */}
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      setMenuVisible(false);

                      router.push({
                        pathname: "/modify-list",
                        params: {
                          id: item.id,
                          title: item.title,
                          description: item.subtitle,
                          colorId: item.idColor,
                        },
                      });
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      gap: 8,
                      borderBottomWidth: 1,
                      borderBottomColor: "#F3F4F6",
                    }}
                  >
                    <Ionicons
                      name="pencil-outline"
                      size={16}
                      color="#2563EB"
                    />
                    <Text
                      style={{
                        color: "#2563EB",
                        fontSize: 14,
                        fontWeight: "500",
                      }}
                    >
                      Modify list
                    </Text>
                  </TouchableOpacity>

                  {/* Delete */}
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      setMenuVisible(false);
                      setDeleteModalVisible(true);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      gap: 8,
                    }}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={16}
                      color="#BA1A1A"
                    />
                    <Text
                      style={{
                        color: "#BA1A1A",
                        fontSize: 14,
                        fontWeight: "500",
                      }}
                    >
                      Delete list
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <Text className="text-sm text-gray-500 mb-2">
            {item.subtitle}
          </Text>

          <Box className="mb-3">
            <Progress value={item.percentage} size="md">
              <ProgressFilledTrack
                style={{
                  backgroundColor: item.color,
                }}
              />
            </Progress>

            <Text className="text-xs text-gray-500 mt-1">
              {item.percentage}% complete
            </Text>
          </Box>
        </Box>
      </Pressable>

      <DeleteListModal
        visible={deleteModalVisible}
        listId={item.id}
        onDeleted={(id) => {
          setDeleteModalVisible(false);
          onDelete?.(id);
        }}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </>
  );
};

export default TaskListCard;