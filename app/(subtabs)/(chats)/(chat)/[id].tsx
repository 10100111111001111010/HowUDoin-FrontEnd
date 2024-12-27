import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ChatScreenHeader from '@/components/ui/ChatScreenHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  createdAt: string;
  updatedAt: string;
}

const Chat = () => {
  const [userId, setUserId] = useState('');
  const { id, name } = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Mesajları düzenli olarak yenile
  useEffect(() => {
    const loadInitialMessages = async () => {
      await fetchMessages();
    };
    loadInitialMessages();

    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const currentUserId = await AsyncStorage.getItem('userId');
      
      if (!userToken || !currentUserId) {
        console.error('User token or ID not found');
        return;
      }

      setUserId(currentUserId);

      const request = await fetch('http://172.20.10.10:8090/api/messages/conversation/' + id, {
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
        // Mesajları tarihe göre sırala
        const sortedMessages = response.content.sort((a: Message, b: Message) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        setMessages(sortedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const currentUserId = await AsyncStorage.getItem('userId');

      if (!userToken || !currentUserId) {
        Alert.alert("Hata", "Kullanıcı bilgileri bulunamadı");
        return;
      }

      // API'ye mesajı gönder
      const request = await fetch('http://172.20.10.10:8090/api/messages/send/' + id, {
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

      if (!request.ok) {
        throw new Error('Message send failed');
      }

      const response = await request.json();

      // Eğer API yanıtı başarılıysa
      if (response) {
        // Yeni mesajı ekle
        const messageToAdd: Message = {
          id: response.id || Date.now().toString(),
          content: newMessage,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          senderId: currentUserId,
          receiverId: id as string,
          status: 'SENT'
        };

        setMessages(prevMessages => [...prevMessages, messageToAdd]);
        setNewMessage('');

        // En alta scroll yap
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Hemen mesajları yeniden yükle
        await fetchMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Hata", "Mesaj gönderilemedi. Lütfen tekrar deneyin.");
    }
  };

  const renderMessageStatus = (status?: 'SENT' | 'DELIVERED' | 'READ') => {
    if (!status) return null;

    let iconName: 'checkmark' | 'checkmark-done' = 'checkmark';
    let iconColor = '#8E8E93';

    switch (status) {
      case 'DELIVERED':
        iconName = 'checkmark-done';
        iconColor = '#8E8E93';
        break;
      case 'READ':
        iconName = 'checkmark-done';
        iconColor = '#4CAF50';
        break;
    }

    return <Ionicons name={iconName} size={16} color={iconColor} style={styles.messageStatus} />;
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUserMessage = item.senderId === userId;
    
    return (
      <View style={[
        styles.messageContainer,
        isUserMessage ? styles.userMessage : styles.otherMessage
      ]}>
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
          {isUserMessage && renderMessageStatus(item.status)}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ChatScreenHeader name={name as string} />
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
    backgroundColor: '#D3C6BA',
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
  messageStatus: {
    marginLeft: 2,
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
    backgroundColor: '#D3C6BA',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Chat;