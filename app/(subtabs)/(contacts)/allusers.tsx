import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import UserBox from '@/components/ui/UserBox';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Friend {
  id: string;
  userId: string;
  friendId: string;
}

export default function AllUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUsersAndFriends();
  }, []);

  const fetchUsersAndFriends = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      
      if (!token || !userId) {
        Alert.alert(
          'Authentication Required',
          'Please log in to view users',
          [{ text: 'OK', onPress: () => router.push('/signin') }]
        );
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Id': userId
      };

      const [usersResponse, friendsResponse] = await Promise.all([
        fetch('http://192.168.1.156:8080/api/users/all', {
          method: 'GET',
          headers
        }),
        fetch('http://192.168.1.156:8080/api/friends/all', {
          method: 'GET',
          headers
        })
      ]);
      
      if (usersResponse.status === 401 || friendsResponse.status === 401) {
        await AsyncStorage.removeItem('userToken');
        Alert.alert(
          'Session Expired',
          'Please log in again to continue',
          [{ text: 'OK', onPress: () => router.push('/signin') }]
        );
        return;
      }

      if (!usersResponse.ok || !friendsResponse.ok) {
        const errorResponse = !usersResponse.ok ? usersResponse : friendsResponse;
        const errorText = await errorResponse.text();
        throw new Error(`Failed to fetch data: ${errorResponse.status} ${errorText}`);
      }
      
      const [usersData, friendsData] = await Promise.all([
        usersResponse.json(),
        friendsResponse.json()
      ]);
      
      // Filter out users who are already friends and the current user
      const filteredUsers = usersData.filter((user: User) => {
        // Don't show current user
        if (user.id === userId) return false;
        
        // Don't show users who are already friends
        const isFriend = friendsData.some(
          (friend: User) => friend.id === user.id
        );
        
        return !isFriend;
      });

      setUsers(filteredUsers);
      setFriends(friendsData);
      
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert(
        'Error',
        `Failed to load users: ${(error as Error).message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <UserBox
      id={item.id}
      firstName={item.firstName}
      lastName={item.lastName}
      email={item.email}
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <FlatList
      data={users}
      renderItem={renderUser}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No new users to add as friends!</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3C6BA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 24,
  },
});