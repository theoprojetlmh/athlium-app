import React, { useState } from 'react';
import { View, StyleSheet, Modal, Text, Pressable, ScrollView, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ModelViewer from '../components/ModelViewer';
import AppHeader from '../components/AppHeader';
import { COLORS } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MENU_WIDTH = SCREEN_WIDTH * 0.8;

const HomeScreen = ({ navigation }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [slideAnim] = useState(new Animated.Value(-MENU_WIDTH));

    const openMenu = () => {
        setMenuVisible(true);
        // Animation fluide de gauche vers droite
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeMenu = () => {
        // Animation de fermeture
        Animated.timing(slideAnim, {
            toValue: -MENU_WIDTH,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            setMenuVisible(false);
        });
    };

    const handleItemPress = (screen) => {
        // Fermer immédiatement le modal (pas d'attente)
        setMenuVisible(false);
        slideAnim.setValue(-MENU_WIDTH);

        if (screen) {
            // Navigation immédiate
            requestAnimationFrame(() => {
                navigation.navigate(screen);
            });
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <AppHeader onMenuPress={openMenu} />
            <ModelViewer navigation={navigation} />

            <Modal
                visible={menuVisible}
                transparent={true}
                animationType="fade" // Fade pour l'overlay seulement
                onRequestClose={closeMenu}
            >
                <View style={styles.modalContainer}>
                    {/* Overlay - clique pour fermer */}
                    <Pressable
                        style={styles.overlay}
                        onPress={closeMenu}
                    />

                    {/* Menu Panel - GAUCHE avec animation */}
                    <Animated.View
                        style={[
                            styles.menuPanel,
                            {
                                transform: [{ translateX: slideAnim }]
                            }
                        ]}
                    >
                        {/* Header */}
                        <View style={styles.menuHeader}>
                            <Text style={styles.menuTitle}>💪 ATHLIUM</Text>
                            <Text style={styles.menuSubtitle}>Votre coach digital</Text>
                        </View>

                        {/* Items du menu */}
                        <ScrollView style={styles.menuItems}>
                            {/* Accueil */}
                            <Pressable
                                style={({ pressed }) => [
                                    styles.menuItem,
                                    pressed && styles.menuItemPressed
                                ]}
                                onPress={() => handleItemPress(null)}
                            >
                                <View style={styles.menuItemContent}>
                                    <Text style={styles.menuItemTitle}>🏠 Accueil</Text>
                                    <Text style={styles.menuItemSubtitle}>Retour au modèle 3D</Text>
                                </View>
                                <Text style={styles.menuItemArrow}>→</Text>
                            </Pressable>

                            {/* Tous les exercices */}
                            <Pressable
                                style={({ pressed }) => [
                                    styles.menuItem,
                                    pressed && styles.menuItemPressed
                                ]}
                                onPress={() => handleItemPress('Categories')}
                            >
                                <View style={styles.menuItemContent}>
                                    <Text style={styles.menuItemTitle}>📋 Tous les exercices</Text>
                                    <Text style={styles.menuItemSubtitle}>Parcourir tous les exercices</Text>
                                </View>
                                <Text style={styles.menuItemArrow}>→</Text>
                            </Pressable>

                            {/* Feedback */}
                            <Pressable
                                style={({ pressed }) => [
                                    styles.menuItem,
                                    pressed && styles.menuItemPressed
                                ]}
                                onPress={() => handleItemPress('Feedback')}
                            >
                                <View style={styles.menuItemContent}>
                                    <Text style={styles.menuItemTitle}>💡 Donner mon avis</Text>
                                    <Text style={styles.menuItemSubtitle}>Partage tes idées et bugs</Text>
                                </View>
                                <Text style={styles.menuItemArrow}>→</Text>
                            </Pressable>
                        </ScrollView>

                        {/* Footer */}
                        <View style={styles.menuFooter}>
                            <Text style={styles.footerText}>Version 1.0.0</Text>
                            <Text style={styles.footerSubtext}>Fait avec 💚 en France</Text>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    modalContainer: {
        flex: 1,
        flexDirection: 'row', // Important pour le layout horizontal
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    menuPanel: {
        position: 'absolute',
        left: 0, // Collé à GAUCHE
        top: 0,
        bottom: 0,
        width: MENU_WIDTH,
        backgroundColor: COLORS.background,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 16,
    },
    menuHeader: {
        padding: 30,
        paddingTop: 60,
        backgroundColor: COLORS.primary,
        borderBottomWidth: 3,
        borderBottomColor: COLORS.accent,
    },
    menuTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 5,
    },
    menuSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    menuItems: {
        flex: 1,
        paddingTop: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.backgroundCard,
        backgroundColor: COLORS.background,
    },
    menuItemPressed: {
        backgroundColor: COLORS.primaryDark,
    },
    menuItemContent: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    menuItemSubtitle: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    menuItemArrow: {
        fontSize: 20,
        color: COLORS.accent,
        marginLeft: 10,
    },
    menuFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.backgroundCard,
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    footerText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 5,
    },
    footerSubtext: {
        fontSize: 11,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
    },
});

export default HomeScreen;