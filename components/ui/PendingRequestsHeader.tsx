import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const PendingRequestsHeader = () => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back-circle-outline" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        Pending Friend Requests
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    minHeight: 56,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#D3C6BA',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    zIndex: 1,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    position: 'relative',
    maxWidth: '80%',
    marginLeft: 30,
    textAlign: 'center',
    color: '#000000',
  },
  ListContainer: {
    padding: 16,
    paddingTop: 0,
  },
  backButton: {
    padding: 4,
  },
});

export default PendingRequestsHeader;