import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Text, Pressable, ScrollView, Dimensions, Animated, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import ModelViewer from '../components/ModelViewer';
import AppHeader from '../components/AppHeader';
import { COLORS } from '../constants/colors';

// Import des vraies pages
import ChangelogScreen from './ChangelogScreen';
import WelcomeScreen from './WelcomeScreen';
import FeedbackScreen from './FeedbackScreen';
import { useResponsive } from '../hooks/useResponsive';

const HomeScreen = ({ navigation }) => {
    // ✅ CORRECTION : Le hook doit être ICI, dans le composant
    const { maxWidths } = useResponsive();
    const MENU_WIDTH = maxWidths.menu;

    const [menuVisible, setMenuVisible] = useState(false);
    const [slideAnim] = useState(new Animated.Value(-MENU_WIDTH));

    // États pour les modals
    const [showChangelog, setShowChangelog] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    // Initialiser la barre de navigation transparente au chargement
    useEffect(() => {
        if (Platform.OS === 'android') {
            NavigationBar.setBackgroundColorAsync('#00000000');
            NavigationBar.setButtonStyleAsync('light');
            NavigationBar.setVisibilityAsync('visible');
        }
    }, []);

    const openMenu = () => {
        setMenuVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeMenu = () => {
        Animated.timing(slideAnim, {
            toValue: -MENU_WIDTH,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            setMenuVisible(false);
        });
    };

    const handleItemPress = (action) => {
        // Fermer le menu immédiatement
        setMenuVisible(false);
        slideAnim.setValue(-MENU_WIDTH);

        // Attendre que le menu soit fermé avant d'ouvrir le modal
        setTimeout(() => {
            if (action === 'Changelog') {
                setShowChangelog(true);
            } else if (action === 'Welcome') {
                setShowWelcome(true);
            } else if (action === 'Feedback') {
                setShowFeedback(true);
            } else if (action === 'Categories') {
                navigation.navigate('Categories');
            }
            // Si action === null, on fait rien (ferme juste le menu)
        }, 300);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <AppHeader onMenuPress={openMenu} />
            <ModelViewer navigation={navigation} />

            {/* MENU GLISSANT - Sans Modal pour éviter le changement de couleur */}
            {menuVisible && (
                <View style={styles.modalContainer}>
                    <Pressable style={styles.overlay} onPress={closeMenu} />

                    <Animated.View
                        style={[
                            styles.menuPanel,
                            {
                                width: MENU_WIDTH,  // ✅ Utilise la valeur calculée
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
                        <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
                            {/* Accueil */}
                            <Pressable
                                style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
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
                                style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                                onPress={() => handleItemPress('Categories')}
                            >
                                <View style={styles.menuItemContent}>
                                    <Text style={styles.menuItemTitle}>📋 Tous les exercices</Text>
                                    <Text style={styles.menuItemSubtitle}>Parcourir tous les exercices</Text>
                                </View>
                                <Text style={styles.menuItemArrow}>→</Text>
                            </Pressable>

                            {/* Notes de version - MODAL */}
                            <Pressable
                                style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                                onPress={() => handleItemPress('Changelog')}
                            >
                                <View style={styles.menuItemContent}>
                                    <Text style={styles.menuItemTitle}>📋 Notes de version</Text>
                                    <Text style={styles.menuItemSubtitle}>Nouveautés et mises à jour</Text>
                                </View>
                                <Text style={styles.menuItemArrow}>→</Text>
                            </Pressable>

                            {/* Vision du projet - MODAL */}
                            <Pressable
                                style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                                onPress={() => handleItemPress('Welcome')}
                            >
                                <View style={styles.menuItemContent}>
                                    <Text style={styles.menuItemTitle}>🎯 Vision du projet</Text>
                                    <Text style={styles.menuItemSubtitle}>Découvre l'histoire d'Athlium</Text>
                                </View>
                                <Text style={styles.menuItemArrow}>→</Text>
                            </Pressable>

                            {/* Feedback - MODAL */}
                            <Pressable
                                style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
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
            )}

            {/* MODAL CHANGELOG - Affiche la vraie page */}
            <Modal
                visible={showChangelog}
                transparent={false}
                animationType="slide"
                onRequestClose={() => setShowChangelog(false)}
            >
                <SafeAreaView style={styles.modalPageContainer} edges={['top']}>
                    {/* La vraie page Changelog avec bouton retour intégré */}
                    <ChangelogScreen onBack={() => setShowChangelog(false)} />
                </SafeAreaView>
            </Modal>

            {/* MODAL WELCOME - Affiche la vraie page */}
            <Modal
                visible={showWelcome}
                transparent={false}
                animationType="slide"
                onRequestClose={() => setShowWelcome(false)}
            >
                <SafeAreaView style={styles.modalPageContainer} edges={['top']}>
                    {/* La vraie page Welcome avec bouton retour intégré */}
                    <WelcomeScreen
                        onComplete={() => setShowWelcome(false)}
                        onBack={() => setShowWelcome(false)}
                    />
                </SafeAreaView>
            </Modal>

            {/* MODAL FEEDBACK - Affiche la vraie page */}
            <Modal
                visible={showFeedback}
                transparent={false}
                animationType="slide"
                onRequestClose={() => setShowFeedback(false)}
            >
                <SafeAreaView style={styles.modalPageContainer} edges={['top']}>
                    {/* La vraie page Feedback avec navigation mock (a déjà son bouton retour) */}
                    <FeedbackScreen
                        navigation={{
                            ...navigation,
                            goBack: () => setShowFeedback(false)
                        }}
                    />
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',  // ✅ Transparent pour voir le gradient du ModelViewer
    },
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        flexDirection: 'row',
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
        left: 0,
        top: 0,
        bottom: 0,
        // width est maintenant définie dynamiquement dans le JSX
        backgroundColor: COLORS.background,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 16,
    },
    menuHeader: {
        padding: 20,
        paddingTop: 50,
        paddingBottom: 18,
        backgroundColor: COLORS.primary,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    menuTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
        textShadowColor: 'rgba(139, 92, 246, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    menuSubtitle: {
        fontSize: 13,
        color: COLORS.text,
        opacity: 0.85,
    },
    menuItems: {
        flex: 1,
        paddingTop: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
        marginHorizontal: 12,
        marginVertical: 6,
        backgroundColor: COLORS.backgroundCard,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.accent,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    menuItemPressed: {
        backgroundColor: COLORS.primaryDark,
        opacity: 0.8,
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
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: 'rgba(82, 250, 124, 0.1)',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
    },
    footerText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginBottom: 6,
        fontWeight: '600',
    },
    footerSubtext: {
        fontSize: 12,
        color: COLORS.accent,
        fontStyle: 'italic',
    },

    // STYLES POUR LES MODALS DE PAGES COMPLÈTES
    modalPageContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});

export default HomeScreen;