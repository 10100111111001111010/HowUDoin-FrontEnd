import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface GroupDetailsHeaderProps {
  groupName?: string;
}

const GroupDetailsHeader: React.FC<GroupDetailsHeaderProps> = ({ groupName }) => {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back-circle-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Group Details
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D3C6BA',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default GroupDetailsHeader;