import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUsersAndFriends();
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchText, users]);

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
      
      const filteredUsers = usersData.filter((user: User) => {
        if (user.id === userId) return false;
        
        const isFriend = friendsData.some(
          (friend: User) => friend.id === user.id
        );
        
        return !isFriend;
      });

      setUsers(filteredUsers);
      setFilteredUsers(filteredUsers);
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
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Start searching..."
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Ionicons 
          name="search" 
          size={20} 
          color="#666" 
          style={styles.searchIcon} 
        />
      </View>
      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No new users to add as friends!</Text>
        }
      />
    </View>
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
  searchContainer: {
    position: 'relative',
    marginHorizontal: 16,
    marginVertical: 6,
    marginTop: 2,
    marginBottom: 8,
  },
  searchInput: {
    height: 40,
    padding: 10,
    paddingRight: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  searchIcon: {
    position: 'absolute',
    right: 12,
    top: 10,
  }
});