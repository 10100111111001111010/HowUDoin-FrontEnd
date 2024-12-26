import { View } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import GroupDetails from '../../../../components/ui/GroupDetails';

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen 
        options={{
          headerShown: false
        }}
      />
      <GroupDetails groupId={id} />
    </View>
  );
}