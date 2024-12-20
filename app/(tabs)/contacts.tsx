import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RelativePathString, useRouter } from 'expo-router';
import ContactsHeader from '../../components/ui/ContactsHeader';
import ContactBox from '@/components/ui/ContactBox';
import SearchBar from '@/components/ui/SearchBar';

interface Contact {
  id: string;
  name: string;
}

const Contacts = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Nusret',
    },
    {
      id: '2',
      name: 'Ahmet',
    },
    {
      id: '3',
      name: 'Thiam',
    },
    {
      id: '4',
      name: 'Dries',
    },
    {
      id: '5',
      name: 'Ciro',
    },
    {
      id: '6',
      name: 'Bob',
    },
    {
      id: '7',
      name: 'Alice',
    },
    {
      id: '8',
      name: 'Eve',
    },
    {
      id: '9',
      name: 'Adam',
    },
  ]);

  const handleContactPress = (contactId: string) => {
    const path = `/(subtabs)/(contacts)/${contactId}`;
    router.push(path as RelativePathString);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <ContactBox
      userId={item.id}
      name={item.name}
      onPress={() => handleContactPress(item.id)}
    />
  );

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <ContactsHeader />
      <View style={{marginTop: 5, paddingHorizontal: 3}}> 
        <SearchBar onSearchChange={handleSearch} />
      </View>
      <View style={styles.content}>
        <FlatList
          data={filteredContacts}
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