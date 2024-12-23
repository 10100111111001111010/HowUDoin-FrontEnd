import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#D3C6BA',
            opacity: 0.8,
            borderTopWidth: 2,
            borderTopColor: colorScheme === 'dark' ? '#333333' : 'rgba(0,0,0,0.1)',
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
            // Remove marginBottom completely
          },
          tabBarInactiveTintColor: colorScheme === 'dark' ? '#888888' : '#000000',
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
          name="groupchats"
          options={{
            title: 'Group Chats',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-group" size={32} color={color} />
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
    </SafeAreaProvider>
  );
}