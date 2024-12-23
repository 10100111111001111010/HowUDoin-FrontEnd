import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const HelpHeader = () => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Help & Support</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height : 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 4,
        backgroundColor: '#D3C6BA',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
    },
});

export default HelpHeader;