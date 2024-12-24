import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const ContactsHeader = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push('/(subtabs)/(contacts)/allusers');
  };

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Contacts</Text>
      <TouchableOpacity 
        style={styles.plusButton}
        onPress={handlePress}
      >
        <MaterialIcons 
          name="person-add-alt-1" 
          size={29.5} 
          color="#000000"
        />
      </TouchableOpacity>
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
  plusButton: {
    padding: 8,
  },
});

export default ContactsHeader;