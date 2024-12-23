import {View, Text, SafeAreaView, StyleSheet} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import HelpHeader from '../../../components/ui/HelpHeader'

const Help = () => {
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <HelpHeader />
            <View style={styles.textContainer}>
                <Text style={styles.text}>Nothing to see here!</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D3C6BA',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 22,
        fontWeight: 'semibold'
    },
});

export default Help