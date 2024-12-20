import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import ChatsHeader from '../../components/ui/ChatsHeader';
import {View} from 'react-native';

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#E8DACD',
          borderTopWidth: 0.5,
          borderTopColor: colorScheme === 'dark' ? '#333333' : '#000000',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        // Default color for inactive tabs
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#888888' : '#666666',
        // Default color for active tabs
        tabBarActiveTintColor: '#007AFF',
        headerShown: false,
      }}>
      
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={24} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={32} color={color} />
          ),
        }}
      />
      
      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}