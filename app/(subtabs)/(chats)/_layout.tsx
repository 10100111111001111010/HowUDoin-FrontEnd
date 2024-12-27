import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

export default function ChatsLayout() {
  return (

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="creategroupchat"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

  );
}