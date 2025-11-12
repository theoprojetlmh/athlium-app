// components/AppHeader.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { useResponsive } from '../hooks/useResponsive';

const AppHeader = ({ onMenuPress }) => {
    const { fontSize } = useResponsive();
    const insets = useSafeAreaInsets(); // ✅ Récupère la hauteur de la barre de statut

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Bouton Menu à gauche */}
            <TouchableOpacity
                style={styles.menuButton}
                onPress={onMenuPress}
                activeOpacity={0.6}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
                <Text style={styles.menuButtonText}>☰</Text>
            </TouchableOpacity>

            {/* Titre centré au milieu */}
            <View style={styles.titleContainer}>
                <Text style={[styles.title, { fontSize: fontSize.xl }]}>💪 ATHLIUM</Text>
            </View>

            {/* Spacer invisible à droite pour équilibrer */}
            <View style={styles.spacer} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.background,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        zIndex: 1000,
        elevation: 10,
    },
    menuButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 8,
    },
    menuButtonText: {
        fontSize: 26,
        color: COLORS.background,
        fontWeight: 'bold',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontWeight: 'bold',
        color: COLORS.text,
        letterSpacing: 1,
    },
    spacer: {
        width: 50,
    },
});

export default AppHeader;