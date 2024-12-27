import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface GroupChatHeaderProps {
  groupName: string;
}

const GroupChatHeader = ({ groupName }: GroupChatHeaderProps) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => router.navigate('/groupchats')}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back-circle-outline" size={24} color="#000" />
      </TouchableOpacity>
      
      <View style={styles.profileContainer}>
        <View style={styles.avatar}>
          <Ionicons name="people" size={24} color="#FFFFFF" />
        </View>
        <View style={styles.groupInfo}>
          <Text style={styles.name}>{groupName}</Text>
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
  groupInfo: {
    marginLeft: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default GroupChatHeader;