import { View, StyleSheet, Pressable, Text, Alert } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SettingsHeader from '@/components/ui/SettingsHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsRoute = 
  | 'profile'
  | 'account'
  | 'notifications'
  | 'privacy'
  | 'chat-settings'
  | 'help'
  | 'sign-out'
  | 'delete-account';

interface MenuItem {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  route: SettingsRoute;
}

const Settings = () => {
  const router = useRouter();

  const menuItems: MenuItem[] = [
    { 
      title: 'Profile', 
      iconName: 'person-outline', 
      route: 'profile'
    },
    { 
      title: 'Account', 
      iconName: 'key-outline', 
      route: 'account'
    },
    { 
      title: 'Notifications', 
      iconName: 'notifications-outline', 
      route: 'notifications'
    },
    { 
      title: 'Privacy', 
      iconName: 'lock-closed-outline', 
      route: 'privacy'
    },
    { 
      title: 'Chat Settings', 
      iconName: 'chatbubble-outline', 
      route: 'chat-settings'
    },
    { 
      title: 'Help & Support', 
      iconName: 'help-circle-outline', 
      route: 'help'
    },
    { 
      title: 'Sign Out', 
      iconName: 'log-out-outline', 
      route: 'sign-out'
    },
    { 
      title: 'Delete Account', 
      iconName: 'trash-bin-outline', 
      route: 'delete-account'
    },
  ];

  const handleSignOut = async () => {
    try {
      // Kullanıcı bilgilerini temizle
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');
      
      // Bilgi mesajı göster ve giriş sayfasına yönlendir
      Alert.alert('Success', 'You have been signed out.');
      router.replace('/(auth)/signin');
    } catch (error) {
      console.error('Error during sign-out:', error);
      Alert.alert('Error', 'An error occurred while signing out.');
    }
  };

  const handlePress = (route: SettingsRoute) => {
    if (route === 'sign-out') {
      handleSignOut();
    } else {
      router.push(`/(subtabs)/(settings)/${route}` as const);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SettingsHeader />
      <View style={styles.content}>
        {menuItems.map((item, index) => (
          <Pressable
            key={item.route}
            style={({pressed}) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
              index !== menuItems.length - 1 && styles.menuItemBorder
            ]}
            onPress={() => handlePress(item.route)}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.leftContent}>
                <Ionicons name={item.iconName} size={24} color={item.route === 'delete-account' ? '#EF0808' : '#007AFF'} />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
            </View>
          </Pressable>
        ))}
      </View>
      <View>
        <Text style ={styles.softwareVersion}>
           Version 1.0.0 
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3C6BA',
    position: 'relative',
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    backgroundColor: '#D3C6BA',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemPressed: {
    backgroundColor: '#FFFFFF',
  },
  menuItemBorder: {
    borderBottomWidth: 0.18,
    borderBottomColor: '#000000',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuItemText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000000',
  },
  softwareVersion: {
    fontSize: 14,
    fontWeight: 'regular',
    color: '#000000',
    textAlign: 'center',
  },
});

export default Settings;
