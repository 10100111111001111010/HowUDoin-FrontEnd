// components/ui/ChatScreenHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface ChatScreenHeaderProps {
  name: string;
}

const ChatScreenHeader = ({ name }: ChatScreenHeaderProps) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => router.navigate('/chats')}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back-circle-outline" size={24} color="#000" />
      </TouchableOpacity>
      
      <View style={styles.profileContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name[0]}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#D3C6BA',
    borderBottomWidth: 0.5,
    borderBottomColor: '#00000020',
  },
  backButton: {
    padding: 5,
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    marginLeft: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 13,
    color: '#4CAF50',
  },
});

export default ChatScreenHeader;