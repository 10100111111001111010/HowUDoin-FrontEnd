import { View, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ChatsHeader from '../../components/ui/ChatsHeader'

const Chats = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ChatsHeader />
      <View style={styles.content}>
        {/* Your chats list will go here */}
      </View>
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
});

export default Chats