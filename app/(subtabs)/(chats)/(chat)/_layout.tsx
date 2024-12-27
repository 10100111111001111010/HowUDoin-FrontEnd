import { Stack } from "expo-router";
import React from "react";

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
