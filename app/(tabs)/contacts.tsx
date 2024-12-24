import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RelativePathString, useRouter } from 'expo-router';
import ContactsHeader from '../../components/ui/ContactsHeader';
import SearchBar from '@/components/ui/SearchBar';
import ContactBox from '@/components/ui/ContactBox';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
interface Contact {
  id: string;
  name: string;
}
 
const Contacts = () => {
  const router = useRouter();
 
  const [contacts,setContacts] = useState<any>(
 
  );
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        const response = await fetch(`http://172.20.10.10:8090/api/friends`, {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'User-Id': userId as string,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setContacts(data);
      } catch {
        setContacts(null);
      }
    };
 
    fetchUser();
  }, []);
 
  
  const handleContactPress = (contactId: string) => {
    const path = `/(subtabs)/(contacts)/${contactId}`;
    router.push(path as RelativePathString);
  };
 
  const renderItem = ({ item }: { item: Contact }) => (
    <ContactBox
      userId={item.id}
      name={`${item.firstName} ${item.lastName}`}
      onPress={() => handleContactPress(item.id)}
    />
  );
 
  return (
    <SafeAreaView style={styles.container}>
      <ContactsHeader />
 
      <View style={styles.content}>
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
  list: {
    flex: 1,
    backgroundColor: '#D3C6BA',
  },
});
 
export default Contacts;