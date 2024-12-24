import { Stack } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from "expo-status-bar";
import { createContext, useContext, useState } from 'react';

interface AuthContextType {
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => null,
});

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const AuthLayout = () => {
    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            <View style={{ flex: 1 }}>
                <StatusBar style="dark" />
                <Stack screenOptions={{ contentStyle: { backgroundColor: 'white' } }}>
                    <Stack.Screen name="signin" options={{ headerShown: false }} />
                    <Stack.Screen name="signup" options={{ headerShown: false }} />
                </Stack>
            </View>
        </AuthContext.Provider>
    );
};

export default AuthLayout;