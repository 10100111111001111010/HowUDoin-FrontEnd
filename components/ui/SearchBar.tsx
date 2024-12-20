import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color="gray" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Search"
        placeholderTextColor="gray"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 44,
    marginBottom: 590,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: 'black',
  },
});

export default SearchBar;
