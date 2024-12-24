import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PendingRequestsHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Pending Friend Requests</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#D3C6BA',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default PendingRequestsHeader;
