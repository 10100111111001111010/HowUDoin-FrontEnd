// app/_layout.tsx
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SplashScreen } from 'expo-router';
import { Slot, useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types for auth context if needed
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout(): JSX.Element | null {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const inAuthGroup: boolean = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the sign-in page
      router.replace('/sign-in');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to the home page
      router.replace('/(tabs)/chats');
    }
  }, [isReady, isAuthenticated, segments]);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      // Check your authentication status here
      const token = await AsyncStorage.getItem('userToken');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsReady(true);
      // Hide splash screen once we're done
      await SplashScreen.hideAsync();
    }
  };

  // Optional: Add loading component
  if (!isReady) {
    return null;
  }

  // Return the main app content
  return <Slot />;
}