import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname, Href } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import PressableHeaderText from './PressableHeaderText';

const ChatsHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isGroupChatsScreen = pathname.includes('/(tabs)/groupchats');
  
  const chatsRoute: Href = '/(tabs)/chats';
  const groupChatsRoute: Href = '/(tabs)/groupchats';
  const contactsRoute: Href = '/(tabs)/contacts';
  
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <PressableHeaderText
          text="Chats"
          route={chatsRoute}
          isActive={!isGroupChatsScreen}
          isElevated={!isGroupChatsScreen}
          style={styles.leftText}
        />
        <PressableHeaderText
          text="Group Chats"
          route={groupChatsRoute}
          isActive={isGroupChatsScreen}
          isElevated={isGroupChatsScreen}
          style={styles.rightText}
        />
      </View>

      <TouchableOpacity 
        style={styles.plusButton}
        onPress={() => router.push(contactsRoute as any)}
      >
        <Feather name="plus-circle" size={24} color="#000000" />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: '#D3C6BA',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  leftText: {
    marginRight: 2,
  },
  rightText: {
    marginLeft: 2,
  },
  plusButton: {
    padding: 0,
  },
});

export default ChatsHeader;