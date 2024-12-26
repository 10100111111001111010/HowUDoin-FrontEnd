import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import CreateGroupHeader from '../../../components/ui/CreateGroupHeader';

interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
}

const CreateGroupChat = () => {
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [contacts, setContacts] = useState<UserModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    console.log('Fetching contacts...');
    try {
      const userId = await AsyncStorage.getItem('userId');
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('Current userId:', userId);

      if (!userId || !userToken) {
        console.log('No userId or token found');
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const response = await fetch('http://10.51.12.33:8080/api/friends/all', {
        headers: {
          'User-Id': userId,
          'Authorization': `Bearer ${userToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Fetched contacts:', data);
      const simplifiedContacts = data.map((contact: any) => ({
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
      }));
      setContacts(simplifiedContacts);
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to fetch contacts');
    }
  };

  const toggleMemberSelection = (userId: string) => {
    const newSelection = new Set(selectedMembers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedMembers(newSelection);
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    if (selectedMembers.size < 2) {
      Alert.alert('Error', 'Please select at least two members');
      return;
    }

    setIsLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const userToken = await AsyncStorage.getItem('userToken');

      if (!userId) {
        throw new Error('No user ID found');
      }

      const response = await fetch('http://10.51.12.33:8080/api/groups/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Id': userId,
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          name: groupName.trim(),
          memberIds: Array.from(selectedMembers),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create group: ${errorText}`);
      }

      Alert.alert('Success', 'Group created successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Create group error:', error);
      Alert.alert('Error', 'Failed to create group');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (!groupName.trim()) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.noContactsSubtext}>
            Please enter a group name to add members.
          </Text>
        </View>
      );
    }

    if (contacts.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Feather name="users" size={50} color="#666" />
          <Text style={styles.noContactsSubtext}>
            You have no friends to create a group yet!
          </Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => router.push('/(subtabs)/(contacts)/allusers')}
            testID="addFriendsButton"
          >
            <Text style={styles.refreshButtonText}>Add Friends</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <Text style={styles.sectionTitle}>
          Select Members ({selectedMembers.size} selected)
        </Text>
        <ScrollView style={styles.memberList}>
          {contacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={[
                styles.memberItem,
                selectedMembers.has(contact.id) && styles.selectedMember,
              ]}
              onPress={() => toggleMemberSelection(contact.id)}
              testID={`memberItem-${contact.id}`}
            >
              <Text style={styles.memberName}>
                {contact.firstName} {contact.lastName}
              </Text>
              {selectedMembers.has(contact.id) && (
                <Feather name="check" size={20} color="#2ecc71" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <CreateGroupHeader />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Please enter the group name"
          value={groupName}
          onChangeText={setGroupName}
          maxLength={50}
          testID="groupNameInput"
        />
      </View>

      {renderContent()}

      <TouchableOpacity
        style={[
          styles.createButton,
          (isLoading ||
            !groupName.trim() ||
            selectedMembers.size < 2 ||
            contacts.length === 0) &&
            styles.disabledButton,
        ]}
        onPress={handleCreateGroup}
        disabled={
          isLoading ||
          !groupName.trim() ||
          selectedMembers.size < 2 ||
          contacts.length === 0
        }
        testID="createGroupButton"
      >
        <Text style={styles.createButtonText}>
          {isLoading ? 'Creating...' : 'Create Group'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3C6BA',
  },
  inputContainer: {
    padding: 12,
    backgroundColor: '#D3C6BA',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 8,
    color: '#666',
  },
  memberList: {
    flex: 1,
    padding: 12,
    paddingHorizontal: 20,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 4,
    backgroundColor: '#FFFFFF',
  },
  selectedMember: {
    backgroundColor: '#E8F5E9',
  },
  memberName: {
    fontSize: 18,
    fontWeight: '400',
    color: 'black',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noContactsSubtext: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  refreshButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#2ecc71',
    borderRadius: 20,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#2ecc71',
    margin: 16,
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  disabledButton: {
    backgroundColor: '#a5d6a7',
    elevation: 0,
    shadowOpacity: 0,
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreateGroupChat;
