import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/colors';

const AppHeader = ({ onMenuPress }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            {/* Bouton Menu (hamburger) */}
            <TouchableOpacity
                style={styles.iconButton}
                onPress={onMenuPress}
                activeOpacity={0.7}
            >
                <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>

            {/* Logo / Titre */}
            <Text style={styles.logo}>ATHLIUM</Text>

            {/* Bouton Feedback */}
            <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate('Feedback')}
                activeOpacity={0.7}
            >
                <Text style={styles.feedbackIcon}>💬</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.backgroundCard,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuIcon: {
        fontSize: 28,
        color: COLORS.text,
    },
    logo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        letterSpacing: 2,
    },
    feedbackIcon: {
        fontSize: 24,
    },
});

export default AppHeader;