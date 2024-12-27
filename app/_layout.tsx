import { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Slot, useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    async function prepare() {
      try {
        // Check authentication status
        const token = await AsyncStorage.getItem('userToken');
        setIsAuthenticated(!!token);
        setIsReady(true);
      } catch (error) {
        console.error('Error preparing app:', error);
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => 
    {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';
      console.log("login debug", isAuthenticated,inAuthGroup);
    if (isAuthenticated && inAuthGroup) 
    {
      router.replace('/(tabs)/chats');
    } else if(isAuthenticated && inAuthGroup){
      router.replace('/(auth)/signin');
    }

    SplashScreen.hideAsync();
  }, [isReady, isAuthenticated, segments]);

  if (!isReady) {
    return null;
  }

  return <Slot />;
}