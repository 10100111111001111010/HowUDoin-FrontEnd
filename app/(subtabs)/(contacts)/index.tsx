import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ContactsHeader from '../../../components/ui/ContactsHeader';  // adjust the path as needed

const Contacts = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ContactsHeader />
      <View>
        <Text>Contacts</Text>
      </View>
    </SafeAreaView>
  );
};

export default Contacts;