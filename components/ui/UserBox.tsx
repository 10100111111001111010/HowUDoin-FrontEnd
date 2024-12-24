import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface UserBoxProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const UserBox: React.FC<UserBoxProps> = ({
  id,
  firstName,
  lastName,
  email,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const getInitials = () => {
    return `${firstName[0]}`.toUpperCase();
  };

  const handleAddFriend = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert(
          'Authentication Required',
          'Please log in to add friends',
          [{ text: 'OK', onPress: () => router.push('/signin') }]
        );
        return;
      }

      const response = await fetch(`http://10.51.12.33:8080/api/friends/add/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        await AsyncStorage.removeItem('token');
        Alert.alert(
          'Session Expired',
          'Please log in again to continue',
          [{ text: 'OK', onPress: () => router.push('/signin') }]
        );
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send friend request: ${response.status} ${errorText}`);
      }

      Alert.alert(
        'Success',
        'Friend request sent successfully!',
        [{ text: 'OK' }]
      );

    } catch (error) {
      Alert.alert(
        'Error',
        `Failed to send friend request: ${(error as Error).message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.userCard}>
      <View style={styles.userContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials()}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{firstName} {lastName}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={[styles.addButton, isLoading && styles.addButtonDisabled]}
        onPress={handleAddFriend}
        disabled={isLoading}
      >
        <Text style={styles.addButtonText}>
          {isLoading ? 'Adding...' : 'Add Friend'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#D3C6BA',
    opacity: 0.8,
    borderRadius: 22,
    borderColor: '#000',
    borderWidth: 0.6,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default UserBox;