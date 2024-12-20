import { View, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SettingsHeader from '../../components/ui/SettingsHeader'

const Settings = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SettingsHeader />
      <View style={styles.content}>
        {/* Settings will go here */}
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
});

export default Settings