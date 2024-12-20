import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ContactBoxProps {
  userId: string;
  name: string;

  onPress?: () => void;
}

const ContactBox: React.FC<ContactBoxProps> = ({
  name,
  onPress
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name[0]}</Text>
      </View>

      {}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#D3C6BA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
});

export default ContactBox;