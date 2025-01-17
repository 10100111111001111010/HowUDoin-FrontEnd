import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ChatBoxProps {
  chatId: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  status?: 'SENT' | 'DELIVERED' | 'READ';
  onPress?: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  name,
  lastMessage,
  timestamp,
  unreadCount = 0,
  status,
  onPress
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Avatar Circle */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name[0]}</Text>
      </View>

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
            {unreadCount > 0 && 
            (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
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
  status: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
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
});

export default ChatBox;