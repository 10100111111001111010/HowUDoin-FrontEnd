import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { RelativePathString, useRouter } from 'expo-router';

interface ChatBoxProps {
  chatId: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  onPress?: () => void;
}

const GroupChatBox: React.FC<ChatBoxProps> = ({
  chatId,
  name,
  lastMessage,
  timestamp,
  unreadCount = 0,
  onPress
}) => {
  const router = useRouter();

  const handleMessage = () => {
    router.push(`/(subtabs)/(chats)/groupmessagingscreen/${chatId}` as RelativePathString);
  };

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
    marginTop: 6,
  },
  lastMessage: {
    fontSize: 15,
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