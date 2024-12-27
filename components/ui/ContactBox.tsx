import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { RelativePathString, useRouter } from 'expo-router';

interface ContactBoxProps {
  userId: string;
  firstName: string;
  lastName: string;
  onPress?: () => void;
}

const ContactBox: React.FC<ContactBoxProps> = ({
  userId,
  firstName,
  lastName,
  onPress
}) => {
  const router = useRouter();
  const fullName = `${firstName} ${lastName}`;
  const initials = `${firstName[0]}${lastName[0]}`;

  const handleMessage = () => {
    router.push(`/(subtabs)/(chats)/(chat)/${userId}?name=${fullName}` as RelativePathString);
  };

  return (
    <View style={styles.container}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{fullName}</Text>
        </View>
      <TouchableOpacity 
        style={styles.messageButton} 
        onPress={handleMessage}
      >
        <Entypo name="new-message" size={23} color="black" />
      </TouchableOpacity>
    </View>
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
    alignItems: 'center',
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
  name: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  messageButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default ContactBox;