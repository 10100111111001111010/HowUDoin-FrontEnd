import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import GroupChatScreenHeader from '@/components/ui/GroupChatScreenHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const GroupChat = () => {
  const [userId, setUserId] = useState('');
  const { id, name } = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderNames, setSenderNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadInitialMessages = async () => {
      await fetchMessages();
    };
    loadInitialMessages();

    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUserNames = async () => {
      const userIds = new Set(messages.map(message => message.senderId));
      const userNamesToFetch = Array.from(userIds).filter(userId => !senderNames[userId]);
  
      if (userNamesToFetch.length === 0) return;
  
      const requests = userNamesToFetch.map(async (userId) => {
        const userToken = await AsyncStorage.getItem('userToken');
        const req = await fetch('http://192.168.1.156:8080/api/users/' + userId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
        });
  
        if (!req.ok) {
          console.error('Error fetching user:', userId);
          return;
        }
  
        const response = await req.json();
        return { [userId]: `${response.firstName} ${response.lastName}` };
      });
  
      const fetchedNames = await Promise.all(requests);
      setSenderNames(prevNames => ({ ...prevNames, ...Object.assign({}, ...fetchedNames) }));
    };
  
    fetchUserNames();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const currentUserId = await AsyncStorage.getItem('userId');
      
      if (!userToken || !currentUserId) {
        console.error('User token or ID not found');
        return;
      }

      setUserId(currentUserId);

      const request = await fetch('http://192.168.1.156:8080/api/groups/' + id + '/messages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
          'User-Id': currentUserId
        },
      });

      if (!request.ok) {
        throw new Error('Network response was not ok');
      }

      const response = await request.json();
      
      if (response && Array.isArray(response.content)) {
        const sortedMessages = response.content.sort((a: Message, b: Message) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setMessages(sortedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUserMessage = item.senderId === userId;
    const senderName = senderNames[item.senderId] || '';
    
    return (
      <View style={[
        styles.messageContainer,
        isUserMessage ? styles.userMessage : styles.otherMessage
      ]}>
        {!isUserMessage && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}
        <Text style={[
          styles.messageText,
          isUserMessage ? styles.userMessageText : styles.otherMessageText
        ]}>{item.content}</Text>
        <View style={styles.messageFooter}>
          <Text style={[
            styles.timestamp,
            isUserMessage ? styles.userTimestamp : styles.otherTimestamp
          ]}>{new Date(item.createdAt).toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}</Text>
        </View>
      </View>
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const currentUserId = await AsyncStorage.getItem('userId');

      if (!userToken || !currentUserId) {
        Alert.alert("Error ", "User token or ID not found");
        return;
      }

      const request = await fetch('http://192.168.1.156:8080/api/groups/' + id + '/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
          'User-Id': currentUserId
        },
        body: JSON.stringify({
          content: newMessage
        })
      });

      console.log('Request.', request);
      if (!request.ok) {
        throw new Error('Message send failed');
      }

      const response = await request.json();

      console.log(response);

      if (response) {
        setNewMessage('');
        await fetchMessages();
        
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("error", "message  couldn't send");
    }
  };
console.log(name)

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <GroupChatScreenHeader groupName={name as string} />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }}
          onLayout={() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="..."
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Ionicons name="send" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3C6BA'
  },
  content: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 20,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9E9E9',
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#000000',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    marginRight: 4,
  },
  userTimestamp: {
    color: '#FFFFFF',
  },
  otherTimestamp: {
    color: '#8E8E93',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GroupChat;