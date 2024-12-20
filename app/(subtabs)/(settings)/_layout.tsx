import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function SettingsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
        },
        headerTintColor: isDark ? '#FFFFFF' : '#000000',
        headerBackTitle: '',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        animation: 'slide_from_right',
      }}
    >
      
      {/* Profile Related Screens */}
      <Stack.Screen 
        name="profile"
        options={{ 
          title: 'Edit Profile',
          headerShown: false
        }} 
      />
    </Stack>
  );
}