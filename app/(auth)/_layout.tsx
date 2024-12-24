import { Stack } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
    return (
        <View style={{ flex: 1 }}>
            <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    contentStyle: { backgroundColor: 'white' }
                }}
            >
                <Stack.Screen
                    name="signin"
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="signup"
                    options={{
                        headerShown: false
                    }}
                />
            </Stack>
        </View>
    );
};

export default AuthLayout;