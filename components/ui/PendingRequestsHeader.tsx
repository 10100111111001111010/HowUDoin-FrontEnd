import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const PendingRequestsHeader = () => {
 const router = useRouter();

 return (
   <View style={styles.header}>
     <Text style={styles.headerTitle}>Pending Friend Requests</Text>
     <TouchableOpacity 
       style={styles.backButton}
       onPress={() => router.back()}
     >
       <Text style={styles.backText}>Back</Text>
     </TouchableOpacity>
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
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
 },
 headerTitle: {
   fontSize: 24,
   fontWeight: 'bold',
   color: '#000',
 },
 backButton: {
   padding: 8,
 },
 backText: {
   fontSize: 16,
   color: '#000',
 }
});

export default PendingRequestsHeader;
