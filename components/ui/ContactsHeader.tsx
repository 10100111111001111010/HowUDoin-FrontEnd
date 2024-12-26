import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../app/(auth)/_layout';

const ContactsHeader = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [hasPendingRequests, setHasPendingRequests] = useState(false);

  useEffect(() => {
    const checkPendingRequests = async () => {
      if (!user?.id) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/friends/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          console.error('Server error:', response.status);
          return;
        }
        
        const requests = await response.json();
        setHasPendingRequests(Array.isArray(requests) && requests.length > 0);
      } catch (error) {
        console.error('Error checking pending requests:', error);
      }
    };

    if (user?.id) {
      checkPendingRequests();
      const interval = setInterval(checkPendingRequests, 15000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

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
              color={hasPendingRequests ? "#FF4B4B" : "#000000"}
            />
            {hasPendingRequests && (
              <View style={styles.notificationDot} />
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
  notificationDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4B4B',
  },
});

export default ContactsHeader;