import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface GroupDetailsProps {
  groupId: string;
}

interface GroupModel {
  id: string;
  name: string;
  creatorId: string;
  memberIds: Set<string>;
  createdAt: string;
}

interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const GroupDetailsHeader: React.FC<{ groupName?: string }> = ({ groupName }) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.navigate('/groupchats')}
      >
        <Ionicons name="arrow-back-circle-outline" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        Group Details
      </Text>
    </View>
  );
};

const GroupDetails: React.FC<GroupDetailsProps> = ({ groupId }) => {
  const [group, setGroup] = useState<GroupModel | null>(null);
  const [members, setMembers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroupDetails = async () => {
    if (!groupId) {
      setError('No group ID provided');
      setLoading(false);
      return;
    }
  
    try {
      const userId = await AsyncStorage.getItem('userId');
      const userToken = await AsyncStorage.getItem('userToken');
  
      if (!userId || !userToken) {
        throw new Error('Authentication required');
      }
  
      const groupResponse = await fetch(`http://10.51.12.33:8080/api/groups/${groupId}`, {
        headers: {
          'User-Id': userId,
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!groupResponse.ok) {
        throw new Error('Failed to fetch group details');
      }
  
      const groupData = await groupResponse.json();
      console.log('Group Data:', groupData);
  
      const membersResponse = await fetch(`http://10.51.12.33:8080/api/groups/${groupId}/members`, {
        headers: {
          'User-Id': userId,
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!membersResponse.ok) {
        throw new Error('Failed to fetch members');
      }
  
      const membersData = await membersResponse.json();
      console.log('Members Data:', membersData);
  
      setGroup(groupData);
      setMembers(membersData);
      setError(null);
    } catch (err) {
      console.error('Error fetching group:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGroupDetails();
  }, [groupId]);

  const renderMember = ({ item }: { item: UserModel }) => (
    <View style={styles.memberContainer}>
      <View style={styles.memberAvatar}>
        <Text style={styles.memberAvatarText}>
          {item.firstName ? item.firstName.charAt(0).toUpperCase() : ''}
        </Text>
      </View>
      <View style={styles.memberInfo}>
        <View style={styles.memberNameContainer}>
          <Text style={styles.memberName}>{`${item.firstName} ${item.lastName}`}</Text>
          {item.id === group?.creatorId && (
            <Text style={styles.creatorBadge}>Creator</Text>
          )}
        </View>
      </View>
    </View>
  );
  
  

  if (loading && !refreshing) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <GroupDetailsHeader />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !group) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <GroupDetailsHeader />
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error || 'Group not found'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <GroupDetailsHeader groupName={group.name} />
      <View style={styles.content}>
        <View style={styles.groupHeader}>
          <View style={styles.groupAvatarContainer}>
            <Text style={styles.groupAvatarText}>
              {group.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.groupCreatedAt}>
            Created at {new Date(group.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.membersSection}>
          <Text style={styles.membersTitle}>
            Group Members ({members.length})
          </Text>
          <FlatList
            data={members}
            renderItem={renderMember}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.membersList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#007AFF']}
                tintColor="#007AFF"
              />
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3C6BA',
  },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D3C6BA',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#D3C6BA',
  },
  groupAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupAvatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  groupName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  groupCreatedAt: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  membersSection: {
    flex: 1,
    backgroundColor: '#D3C6BA',
  },
  membersTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
    color: '#666',
  },
  membersList: {
    paddingHorizontal: 20,
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'black',
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  memberInfo: {
    marginLeft: 15,
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  memberNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorBadge: {
    fontSize: 13,
    color: '#007AFF',
    marginLeft: 120,
    fontWeight: '500',
  },
  
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default GroupDetails;
