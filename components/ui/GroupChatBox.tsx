import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { RelativePathString, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChatBoxProps {
  chatId: string;
  name: string;
  timestamp: string;
  unreadCount: number;
  onPress?: () => void;
}

interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

const GroupChatBox: React.FC<ChatBoxProps> = ({
  chatId,
  name,
  timestamp,
  unreadCount = 0,
  onPress
}) => {
  const router = useRouter();
  const [lastMessage, setLastMessage] = useState<string>('');

  const handleMessage = () => {
    console.log('chatBoxChatId', chatId);
    router.push(`/(subtabs)/(chats)/(groupchat)/${chatId}?name=${name}` as RelativePathString);
  };

  useEffect(() => {
    const loadInitialMessages = async () => {
      await fetchGroupMessages();
    }
    
    loadInitialMessages();
  }, [lastMessage])

  const fetchGroupMessages = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const userToken = await AsyncStorage.getItem('userToken');
    const request = await fetch(`http://192.168.1.156:8080/api/groups/${chatId}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
        'User-Id': `${userId}`
      }
    });

    const response = await request.json();

    console.log('groupchatbox', response);

    const messages = response.content;

    messages.sort((a : GroupMessage, b : GroupMessage) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    messages.reverse();

    var latestMessage = messages[0];
    
    let prefix = 'You: '

    if (lastMessage !== null) {
      if (latestMessage.senderId === userId) {
      
        console.log('message content: ', latestMessage.content);
        setLastMessage(`${prefix} ${latestMessage.content}`)
      } else {
        const userRequest = await fetch(`http://192.168.1.156:8080/api/users/${latestMessage.senderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
          }
        })

        const userResponse = await userRequest.json();

        prefix = `${userResponse.firstName}:`;

        setLastMessage(`${prefix} ${latestMessage.content}`);
      }
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.mainContent}>
        {/* Avatar Circle */}
        <TouchableOpacity 
          onPress={() => router.push(`/(subtabs)/(contacts)/groupdetails/${chatId}` as RelativePathString)}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name[0]}</Text>
          </View>
        </TouchableOpacity>

        {/* Chat Info */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>

          <View style={styles.messageContainer}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage}
            </Text>
            
            <View style={styles.rightContainer}>            
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.messageButton} 
        onPress={handleMessage}
      >
        <Entypo name="new-message" size={23} color="black" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#D3C6BA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainContent: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  timestamp: {
    fontSize: 13,
    color: '#666',
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  lastMessage: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#f0f0f0',
    fontSize: 12,
    fontWeight: '700',
  },
  messageButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default GroupChatBox;