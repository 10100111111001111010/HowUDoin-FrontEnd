import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../app/(auth)/_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContactsHeader = () => {
 const router = useRouter();
 const [userId, setUserId] = useState('');
 const [hasPendingRequests, setHasPendingRequests] = useState(false);
 const [requests, setRequests] = useState([]);

 useEffect(() => {
   const checkPendingRequests = async () => {
     try {
       const [token, currentUserId] = await Promise.all([
         AsyncStorage.getItem('userToken'),
         AsyncStorage.getItem('userId')
       ]);

       if (!currentUserId) return;
       setUserId(currentUserId);

       const response = await fetch('http://192.168.1.156:8080/api/friends/requests/pending', {
         method: 'GET',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`,
           'User-Id': currentUserId
         }
       });

       if (!response.ok) {
         console.error('Server error:', response.status);
         return;
       }

       const data = await response.json();
       setRequests(data);
       setHasPendingRequests(data.length > 0);
     } catch (error) {
       console.error('Error:', error);
     }
   };

   checkPendingRequests();
   const interval = setInterval(checkPendingRequests, 15000);
   return () => clearInterval(interval);
 }, []);

 const handlePress = () => {
   router.push('/(subtabs)/(contacts)/allusers');
 };

 const handleNotification = () => {
   router.push('/(subtabs)/(contacts)/pendingrequests');
 };

 return (
   <View style={styles.header}>
     <Text style={styles.headerTitle}>Contacts</Text>
     <View style={styles.iconContainer}>
       <TouchableOpacity 
         style={styles.iconButton}
         onPress={handleNotification}
       >
         <View style={styles.notificationContainer}>
           <Octicons
             name="bell"
             margin={-8}
             marginTop={1} 
             size={24} 
             color={"#000000"}
           />
           {hasPendingRequests && requests.length > 0 && (
             <View style={styles.requestCount}>
               <Text style={styles.countText}>{requests.length}</Text>
             </View>
           )}
         </View>
       </TouchableOpacity>
       <TouchableOpacity 
         style={styles.iconButton}
         onPress={handlePress}
       >
         <MaterialIcons 
           name="person-add-alt-1" 
           size={28} 
           color="#000000"
         />
       </TouchableOpacity>
     </View>
   </View>
 );
};

const styles = StyleSheet.create({
 header: {
   height: 50,
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   paddingHorizontal: 16,
   paddingVertical: 4,
   backgroundColor: '#D3C6BA',
   borderBottomWidth: 1,
   borderBottomColor: 'rgba(0,0,0,0.1)',
 },
 headerTitle: {
   fontSize: 26,
   fontWeight: 'bold',
 },
 iconContainer: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 iconButton: {
   padding: 8,
   marginLeft: 4,
 },
 notificationContainer: {
   position: 'relative',
 },
 requestCount: {
   position: 'absolute',
   top: -8,
   right: -14,
   minWidth: 16,
   height: 16,
   borderRadius: 8,
   backgroundColor: '#FF4B4B',
   justifyContent: 'center',
   alignItems: 'center',
   paddingHorizontal: 4,
 },
 countText: {
   color: 'white', 
   fontSize: 10,
   fontWeight: 'bold',
 },
});

export default ContactsHeader;