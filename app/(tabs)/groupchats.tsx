import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RelativePathString, useRouter } from 'expo-router';
import GroupChatsHeader from '../../components/ui/GroupChatsHeader';
import GroupChatBox from '@/components/ui/GroupChatBox';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Group {
  id: string;
  name: string;
  lastMessage?: string;
  timestamp: string;
  unreadCount: number;
}

const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status}`);
      }
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error('Max retries reached');
};

const GroupChats = () => {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
  
      if (!token || !userId) {
        setError('Authentication credentials missing');
        return;
      }
  
      const response = await fetchWithRetry(
        'http://192.168.1.156:8080/api/groups/my-groups',
        {
          headers: {
            'User-Id': userId,  // Changed from 'userId' to 'User-Id'
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 400) {
        throw new Error('Invalid request. Please check your input.');
      } else if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      } else if (response.status === 403) {
        throw new Error('You do not have permission to access this resource.');
      } else if (!response.ok) {
        throw new Error(`Failed to fetch groups: ${response.status}`);
      }
  
      const data = await response.json();
      setGroups(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching groups:', err);
      
      if (errorMessage.includes('Authentication failed')) {
        await AsyncStorage.multiRemove(['userToken', 'userId']);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChatPress = (chatId: string, name: string) => {
    console.log('chatId', chatId);
    const path = `/(subtabs)/(chats)/(groupchat)/${chatId}?name=${name}`;
    router.push(path as RelativePathString);
  };

  const handleRetry = () => {
    fetchGroups();
  };

  const renderItem = ({ item }: { item: Group }) => (
    <GroupChatBox
      chatId={item.id}
      name={item.name}
      lastMessage={item.lastMessage || ''}
      unreadCount={item.unreadCount || 0}
      onPress={() => handleChatPress(item.id, item.name)} timestamp={''}    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <GroupChatsHeader />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <GroupChatsHeader />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text 
            style={styles.retryText}
            onPress={handleRetry}
          >
            Tap to retry
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <GroupChatsHeader />
      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        onRefresh={fetchGroups}
        refreshing={loading}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You are not a member of a group yet!</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3C6BA',
  },
  list: {
    flex: 1,
    backgroundColor: '#D3C6BA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  retryText: {
    color: '#007AFF',
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
    textDecorationLine: 'underline',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 300,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});

export default GroupChats;