import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import { Link } from 'expo-router';

const SignUpScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignUp = async () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'First name is required!');
      return;
    }

    if (!lastName.trim()) {
      Alert.alert('Error', 'Last name is required!');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address!');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long!');
      return;
    }

    try {
      console.log(firstName,lastName,email,password);
      const response = await fetch('http://192.168.1.5:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        }),
      });

      console.log(response);

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          Alert.alert('Success', 'Registration successful!');
          navigation.navigate('signin'); // Redirect to SignIn page
        } else {
          Alert.alert('Error', data.message || 'Registration failed.');
        }
      } else {
        Alert.alert('Error', data.message || 'Server error occurred.');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
    }
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sign Up</Text>
        
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#666"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#666"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity 
          style={styles.signUpButton}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Link href="/(auth)/signin" style={styles.signInContainer}  relativeToDirectory> 
          <Text style={styles.signInText}>
            Already have an account? 
            <Text style={styles.signInLink}> Sign In</Text>
          </Text>
        </Link>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f5f5f5',
  },
  signUpButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'black',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signInContainer: {
    marginTop: 20,
  },
  signInText: {
    fontSize: 14,
    color: '#333',
  },
  signInLink: {
    color: 'black',
    fontWeight: '600',
  },
});

export default SignUpScreen;
