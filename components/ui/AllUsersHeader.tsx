import { View, Text, StyleSheet, Platform, StatusBar, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const AllUsersHeader = () => {
 const router = useRouter();

 return (
   <SafeAreaView style={styles.safeArea}>
     <View style={styles.header}>
      <TouchableOpacity 
      onPress={() => router.back()}
      style={styles.backButton}
      >
        <Ionicons name="arrow-back-circle-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>
          Find your friends to start chatting!
          </Text>  
     </View>
   </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 safeArea: {
   backgroundColor: '#D3C6BA',
 },
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
 },
 headerTitle: {
   fontSize: 20,
   fontWeight: '500',
   maxWidth: '80%',
   marginLeft: 10,
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

export default AllUsersHeader;