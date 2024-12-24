import { Stack } from 'expo-router';
import AllUsersHeader from '../../../components/ui/AllUsersHeader';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#D3C6BA',
        },
        contentStyle: { 
          backgroundColor: '#D3C6BA',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          header: () => <AllUsersHeader />,
        }}
      />
      <Stack.Screen
        name="allusers"
        options={{
          header: () => <AllUsersHeader />,
        }}
      />
      <Stack.Screen
        name="pendingrequests"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
