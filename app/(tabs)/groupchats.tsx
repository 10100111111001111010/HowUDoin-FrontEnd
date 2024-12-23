import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RelativePathString, useRouter } from 'expo-router';
import GroupChatsHeader from '../../components/ui/GroupChatsHeader';
import ChatBox from '@/components/ui/ChatBox';


interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: 'SENT' | 'DELIVERED' | 'READ';
}

const GroupChats = () => {
  const router = useRouter();

  //Example
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Nusret',
      lastMessage: 'Hello',
      timestamp: '10:30 AM',
      unreadCount: 2,
      status: 'DELIVERED'
    },
    {
      id: '2',
      name: 'Ahmet',
      lastMessage: 'Aloha',
      timestamp: 'Yesterday',
      unreadCount: 0,
      status: 'READ'
    },    
    {
      id: '3',
      name: 'Thiam',
      lastMessage: 'Goal',
      timestamp: 'Today',
      unreadCount: 1,
      status: 'DELIVERED'
    },
    {
      id: '4',
      name: 'Dries',
      lastMessage: 'Hey',
      timestamp: 'Today',
      unreadCount: 0,
      status: 'DELIVERED'
    },
    {
      id: '5',
      name: 'Ciro',
      lastMessage: 'Hey',
      timestamp: 'Today',
      unreadCount: 0,
      status: 'DELIVERED'
    },
    {
      id: '6',
      name: 'Bob',
      lastMessage: 'Hey',
      timestamp: 'Today',
      unreadCount: 0,
      status: 'DELIVERED'
    },
    {
      id: '7',
      name: 'Alice',
      lastMessage: 'Hey',
      timestamp: 'Today',
      unreadCount: 0,
      status: 'DELIVERED'
    },
    {
      id: '8',
      name: 'Eve',
      lastMessage: 'Hey',
      timestamp: 'Today',
      unreadCount: 0,
      status: 'DELIVERED'
    },
    {
      id: '9',
      name: 'Adam',
      lastMessage: 'Hi',
      timestamp: 'Today',
      unreadCount: 0,
      status: 'DELIVERED'
    },

  ]);

  const handleChatPress = (chatId: string) => {
    const path = `/(subtabs)/(chats)/${chatId}` 
    router.push( path as RelativePathString);
  };


  const renderItem = ({ item }: { item: Chat }) => (
    <ChatBox
      chatId={item.id}
      name={item.name}
      lastMessage={item.lastMessage}
      timestamp={item.timestamp}
      unreadCount={item.unreadCount}
      status={item.status}
      onPress={() => handleChatPress(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <GroupChatsHeader />
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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

export default GroupChats;