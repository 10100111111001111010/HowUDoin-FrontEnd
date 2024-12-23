import { Text, TouchableOpacity, StyleSheet, Platform, View } from 'react-native';
import React from 'react';
import { useRouter, Href } from 'expo-router';

interface PressableHeaderTextProps {
  text: string;
  route: Href;
  isActive: boolean;
  isElevated: boolean;
  style?: object;
}

const PressableHeaderText = ({ 
  text, 
  route, 
  isActive, 
  isElevated,
  style 
}: PressableHeaderTextProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      onPress={() => router.push(route as any)}
      style={[
        styles.container,
        isElevated && styles.elevatedContainer,
        isActive && styles.activeContainer,
        style
      ]}
    >
      <Text style={[
        styles.text,
        isActive ? styles.activeText : styles.inactiveText
      ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  elevatedContainer: {
    backgroundColor: '#E5DCD3',
    borderRadius: 22,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  activeContainer: {
    position: 'relative',
  },
  text: {
    fontWeight: 'bold',
  },
  activeText: {
    fontSize: 22,
    color: 'black',
  },
  inactiveText: {
    fontSize: 20,
    color: 'grey',
  },
});

export default PressableHeaderText;