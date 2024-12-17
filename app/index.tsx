import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {

  const token = AsyncStorage.getItem('userToken');
  
  // If there's no token, redirect to sign-in
  if (!token) {
    return <Redirect href="/sign-in" />;
  }
  
  // If there is a token, redirect to chats
  return <Redirect href="/(tabs)/chats" />;
}