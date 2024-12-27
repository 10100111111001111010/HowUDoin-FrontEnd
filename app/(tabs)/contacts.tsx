import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RelativePathString, useRouter } from 'expo-router';
import ContactsHeader from '../../components/ui/ContactsHeader';
import ContactBox from '@/components/ui/ContactBox';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
}

const Contacts = () => {
  const router = useRouter();
  const [contacts, setContacts] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        
        if (!userToken || !userId) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://192.168.1.156:8080/api/friends/all`, {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'User-Id': userId,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Contacts data:', data);
        
        if (Array.isArray(data)) {
          setContacts(data);
        } else {
          setError('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setError('Failed to fetch contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleContactPress = (contactId: string) => {
    const path = `/(subtabs)/(contacts)/${contactId}`;
    router.push(path as RelativePathString);
  };

  const renderItem = ({ item }: { item: UserModel }) => {
    console.log('Rendering contact:', item);
    return (
      <ContactBox
        userId={item.id}
        firstName={item.firstName}
        lastName={item.lastName}
        onPress={() => handleContactPress(item.id)}
      />
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ContactsHeader />
        <View style={styles.content}>
          <Text>Loading contacts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ContactsHeader />
        <View style={styles.content}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ContactsHeader />
      <View style={styles.content}>
        {contacts.length === 0 ? (
          <Text style={styles.emptyText}>No contacts found</Text>
        ) : (
          <FlatList
            data={contacts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        )}
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
    width: '100%',
  },
  list: {
    flex: 1,
    backgroundColor: '#D3C6BA',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  }
});

export default Contacts;