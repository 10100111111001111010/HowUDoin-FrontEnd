import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PendingRequestsHeader from '../../../components/ui/PendingRequestsHeader';




interface FriendRequest {
 id: string;
 senderId: string;
 receiverId: string;
 status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
 createdAt: string;
 updatedAt: string;
}

const PendingRequests = () => {
 const [requests, setRequests] = useState<FriendRequest[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 const fetchPendingRequests = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userId || !userToken) throw new Error('User not authenticated');

    const response = await fetch(`http://192.168.1.156:8080/api/friends/requests/pending`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'User-Id': userId,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch requests');
    const data: FriendRequest[] = await response.json();
    setRequests(data);
    setError(null);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An unknown error occurred');
  } finally {
    setLoading(false);
  }
 };

 useEffect(() => {
   fetchPendingRequests();
 }, []);

 const handleAccept = async (requestId: string) => {
   try {
     const userId = await AsyncStorage.getItem('userId');
     const userToken = await AsyncStorage.getItem('userToken');
     if (!userId || !userToken) throw new Error('User not authenticated');

     const response = await fetch(`http://192.168.1.156:8080/api/friends/accept/${requestId}`, {
       method: 'POST',
       headers: {
        'Authorization': `Bearer ${userToken}`,
        'User-Id': userId,
        'Content-Type': 'application/json',
      },
     });

     if (!response.ok) throw new Error('Failed to accept request');
     setRequests(requests.filter(req => req.id !== requestId));
   } catch (err) {
     setError(err instanceof Error ? err.message : 'An unknown error occurred');
   }
 };

 const handleDecline = async (requestId: string) => {
   try {
     const userId = await AsyncStorage.getItem('userId');
     const userToken = await AsyncStorage.getItem('userToken');
     if (!userId || !userToken) throw new Error('User not authenticated');

     /*const response = await fetch(`http://172.20.10.10:8090/api/friends/requests/${requestId}`, {
       method: 'DELETE',
       headers: {
        'Authorization': `Bearer ${userToken}`,
        'User-Id': userId,
        'Content-Type': 'application/json',
      },
     });

     if (!response.ok) throw new Error('Failed to decline request'); */
     setRequests(requests.filter(req => req.id !== requestId));
   } catch (err) {
     setError(err instanceof Error ? err.message : 'An unknown error occurred');
   }
 };

 const RequestItem = ({ item }: { item: FriendRequest }) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const response = await fetch(`http://192.168.1.156:8080/api/users/${item.senderId}`, {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setUser(data);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, [item.senderId]);

  return (
    <View style={styles.requestItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.requestDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.acceptButton]}
          onPress={() => handleAccept(item.id)}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.declineButton]}
          onPress={() => handleDecline(item.id)}>
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


 if (loading) {
   return (
     <View style={styles.centerContainer}>
       <ActivityIndicator size="large" color="#0000ff" />
     </View>
   );
 }

 return (
   <SafeAreaView style={styles.safeArea}>
     {/* Header */}
     <PendingRequestsHeader />
     
     {/* Error Display */}
     {error && <Text style={styles.errorText}>{error}</Text>}

     {/* List of Requests */}
     <FlatList
       data={requests}
       renderItem={({ item }) => <RequestItem item={item} />}
       keyExtractor={item => item.id}
       ListEmptyComponent={
         <Text style={styles.emptyText}>No pending friend requests</Text>
       }
       contentContainerStyle={styles.listContainer}
     />
   </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 safeArea: {
   flex: 1,
   backgroundColor: '#D3C6BA',
 },
 centerContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
 },
 listContainer: {
   paddingHorizontal: 16,
   paddingTop: 6,
 },
 requestItem: {
   padding: 16,
   borderRadius: 20,
   backgroundColor: '#FFFFFF',
   borderWidth: 1,
   borderColor: '#D3C6BA',
   marginBottom: 12,
 },
 userInfo: {
   marginBottom: 8,
 },
 userName: {
   fontSize: 18,
   fontWeight: '500',
 },
 requestDate: {
   fontSize: 13,
   color: '#666',
 },
 buttonsContainer: {
   flexDirection: 'row',
   justifyContent: 'flex-end',
   gap: 8,
 },
 button: {
   paddingHorizontal: 16,
   paddingVertical: 8,
   borderRadius: 20,
   minWidth: 80,
   alignItems: 'center',
 },
 acceptButton: {
   backgroundColor: '#4CAF50',
 },
 declineButton: {
   backgroundColor: '#f44336',
 },
 buttonText: {
   color: '#fff',
   fontWeight: '500',
 },
 errorText: {
   color: '#f44336',
   textAlign: 'center',
   marginVertical: 8,
 },
 emptyText: {
   textAlign: 'center',
   color: '#666',
   marginTop: 24,
 },
});

export default PendingRequests;
