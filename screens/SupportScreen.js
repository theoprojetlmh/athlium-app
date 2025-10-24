import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

const SupportScreen = ({ navigation }) => {
    const plans = [
        {
            id: 'monthly',
            name: 'Mensuel',
            price: '2,99€',
            period: '/mois',
            features: [
                '✅ Accès à tous les exercices',
                '✅ Programmes personnalisés',
                '✅ Suivi de progression',
                '✅ Mode hors ligne',
                '💚 Soutien le développement',
            ],
            color: COLORS.primary,
        },
        {
            id: 'yearly',
            name: 'Annuel',
            price: '29,99€',
            period: '/an',
            badge: '🎉 Économise 17%',
            features: [
                '✅ Tous les avantages Mensuel',
                '✨ Nouvelles fonctionnalités en avant-première',
                '🎁 Contenus exclusifs',
                '💪 Programmes d\'entraînement avancés',
                '💚 Soutien maximal au développement',
            ],
            color: COLORS.accent,
            recommended: true,
        },
    ];

    const handleSubscribe = (planId) => {
        // TODO: Intégrer un système de paiement (Stripe, RevenueCat, etc.)
        Alert.alert(
            'Bientôt disponible ! 🚀',
            'Les abonnements seront disponibles dans une prochaine mise à jour. Merci de ton intérêt !',
            [{ text: 'OK' }]
        );
    };

    const handleOneTime = () => {
        Alert.alert(
            'Merci ! 💚',
            'Le soutien ponctuel sera bientôt disponible via Buy Me a Coffee ou Ko-fi.',
            [{ text: 'OK' }]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <Text style={styles.title}>💎 Soutenir ATHLIUM</Text>
                <Text style={styles.subtitle}>
                    ATHLIUM est développé avec passion par une petite équipe.
                    Ton soutien nous aide à créer la meilleure app de fitness possible ! 💪
                </Text>

                {/* Plans d'abonnement */}
                {plans.map((plan) => (
                    <View key={plan.id} style={[styles.planCard, plan.recommended && styles.planCardRecommended]}>
                        {plan.recommended && (
                            <View style={styles.recommendedBadge}>
                                <Text style={styles.recommendedText}>⭐ RECOMMANDÉ</Text>
                            </View>
                        )}

                        <Text style={styles.planName}>{plan.name}</Text>
                        <View style={styles.priceRow}>
                            <Text style={styles.planPrice}>{plan.price}</Text>
                            <Text style={styles.planPeriod}>{plan.period}</Text>
                        </View>

                        {plan.badge && (
                            <View style={styles.savingsBadge}>
                                <Text style={styles.savingsText}>{plan.badge}</Text>
                            </View>
                        )}

                        <View style={styles.features}>
                            {plan.features.map((feature, index) => (
                                <Text key={index} style={styles.featureText}>{feature}</Text>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.subscribeButton, { backgroundColor: plan.color }]}
                            onPress={() => handleSubscribe(plan.id)}
                        >
                            <Text style={styles.subscribeButtonText}>
                                Choisir {plan.name}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Soutien ponctuel */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OU</Text>
                    <View style={styles.dividerLine} />
                </View>

                <View style={styles.oneTimeCard}>
                    <Text style={styles.oneTimeTitle}>☕ Offre-moi un café</Text>
                    <Text style={styles.oneTimeSubtitle}>
                        Pas prêt pour un abonnement ? Un petit soutien ponctuel fait toujours plaisir !
                    </Text>
                    <TouchableOpacity
                        style={styles.oneTimeButton}
                        onPress={handleOneTime}
                    >
                        <Text style={styles.oneTimeButtonText}>💚 Faire un don unique</Text>
                    </TouchableOpacity>
                </View>

                {/* Note finale */}
                <View style={styles.noteCard}>
                    <Text style={styles.noteText}>
                        🙏 Merci de soutenir le développement d'ATHLIUM !
                        Chaque contribution nous aide à ajouter de nouvelles fonctionnalités
                        et à améliorer l'app pour toute la communauté.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        lineHeight: 24,
        marginBottom: 30,
    },
    planCard: {
        backgroundColor: COLORS.backgroundCard,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: COLORS.primary,
        position: 'relative',
    },
    planCardRecommended: {
        borderColor: COLORS.accent,
        borderWidth: 3,
    },
    recommendedBadge: {
        position: 'absolute',
        top: -12,
        left: 20,
        backgroundColor: COLORS.accent,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    recommendedText: {
        color: COLORS.background,
        fontSize: 12,
        fontWeight: 'bold',
    },
    planName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 10,
    },
    planPrice: {
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.accent,
    },
    planPeriod: {
        fontSize: 18,
        color: COLORS.textSecondary,
        marginLeft: 5,
    },
    savingsBadge: {
        backgroundColor: COLORS.primaryDark,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 15,
    },
    savingsText: {
        color: COLORS.accent,
        fontSize: 14,
        fontWeight: 'bold',
    },
    features: {
        marginBottom: 20,
    },
    featureText: {
        fontSize: 15,
        color: COLORS.text,
        marginBottom: 8,
        lineHeight: 22,
    },
    subscribeButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    subscribeButtonText: {
        color: COLORS.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.textSecondary,
        opacity: 0.3,
    },
    dividerText: {
        marginHorizontal: 15,
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: 'bold',
    },
    oneTimeCard: {
        backgroundColor: COLORS.backgroundCard,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    oneTimeTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
    },
    oneTimeSubtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        lineHeight: 22,
        marginBottom: 15,
    },
    oneTimeButton: {
        backgroundColor: COLORS.secondary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    oneTimeButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    noteCard: {
        backgroundColor: COLORS.primaryDark,
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
    },
    noteText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 22,
        textAlign: 'center',
    },
});

export default SupportScreen;