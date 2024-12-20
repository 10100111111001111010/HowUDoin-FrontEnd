import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router'



const ChatsHeader = () => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Chats</Text>
      <TouchableOpacity 
        style={styles.plusButton}
        onPress={() => router.push('/contacts')}
      >


        <Feather name="plus-circle" size={25} color="black" />
        
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height : 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: '#D3C6BA',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  plusButton: {
    padding: 8,
  },
});

export default ChatsHeader;