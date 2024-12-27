import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RelativePathString, useRouter } from 'expo-router';
import ChatsHeader from '../../components/ui/ChatsHeader';
import ChatBox from '@/components/ui/ChatBox';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Chat {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  createdAt: string;
  updatedAt: string;
  valid: boolean;
}

const Chats = () => {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [users, setUsers] = useState<Record<string, string>>({});
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const loadInitialData = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      console.log('Stored userId:', storedUserId);
      if (storedUserId) {
        setUserId(storedUserId);
        await fetchChats();
      }
    };

    loadInitialData();
    const interval = setInterval(fetchChats, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chats.length > 0 && userId) {
      fetchUsernames();
    }
  }, [chats, userId]);

  const fetchChats = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
  
      if (!userToken || !userId) {
        console.log("Missing credentials:", { userToken: !!userToken, userId: !!userId });
        return;
      }
  
      const request = await fetch('http://192.168.1.156:8080/api/messages/all?page=0&size=20', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
          'User-Id': userId
        }
      });
  
      if (!request.ok) {
        const errorText = await request.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch chats: ${request.status}`);
      }
  
      const response = await request.json();
      console.log('Fetched chats:', response);
      
      if (Array.isArray(response)) {
        setChats(response);
      } else {
        console.error('Unexpected response format:', response);
        setChats([]);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchUsernames = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const userIds = new Set<string>();
    
    // Collect unique user IDs from chats
    chats.forEach(chat => {
      const otherUserId = chat.senderId === userId ? chat.receiverId : chat.senderId;
      userIds.add(otherUserId);
    });

    // Filter out users we already have
    const userNamesToFetch = Array.from(userIds).filter(id => !users[id]);

    if (userNamesToFetch.length === 0) return;

    try {
      const requests = userNamesToFetch.map(async (id) => {
        const response = await fetch(`http://192.168.1.156:8080/api/users/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
          },
        });

        if (!response.ok) {
          console.error("Error fetching user:", id);
          return null;
        }

        const userData = await response.json();
        return {
          id,
          name: `${userData.firstName} ${userData.lastName}`
        };
      });

      const fetchedUsers = (await Promise.all(requests))
        .filter((user): user is { id: string; name: string } => user !== null)
        .reduce((acc, user) => ({
          ...acc,
          [user.id]: user.name
        }), {});

      setUsers(prev => ({ ...prev, ...fetchedUsers }));
    } catch (error) {
      console.error("Error fetching usernames:", error);
    }
  };

  const getLastMessagesPerUser = (messages: Chat[]) => {
    const conversationMap = new Map<string, Chat>();
    
    messages.forEach(message => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      const existingMessage = conversationMap.get(otherUserId);
      
      if (!existingMessage || new Date(message.createdAt) > new Date(existingMessage.createdAt)) {
        conversationMap.set(otherUserId, message);
      }
    });

    return Array.from(conversationMap.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const handleChatPress = (messageId: string, chatId: string, userName: string) => {
    router.push(`/(subtabs)/(chats)/(chat)/${chatId}?name=${userName}` as RelativePathString);
  };

  const renderItem = ({ item }: { item: Chat }) => {
    const otherUserId = item.senderId === userId ? item.receiverId : item.senderId;
    const userName = users[otherUserId] || "Loading...";
    
    return (
      <ChatBox
        chatId={otherUserId}
        name={userName}
        lastMessage={item.content}
        timestamp={new Date(item.createdAt).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
        unreadCount={0}
        status={item.status}
        onPress={() => handleChatPress(item.id, otherUserId, userName)}
      />
    );
  };

  const lastMessages = getLastMessagesPerUser(chats);

  return (
    <SafeAreaView style={styles.container}>
      <ChatsHeader />
      <FlatList
        data={lastMessages}
        renderItem={renderItem}
        keyExtractor={(item) => {
          const otherUserId = item.senderId === userId ? item.receiverId : item.senderId;
          return otherUserId;
        }}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
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
});

export default Chats;