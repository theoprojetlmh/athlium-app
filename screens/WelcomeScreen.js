// screens/WelcomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { useResponsive } from '../hooks/useResponsive';

const WelcomeScreen = ({ onComplete, onBack }) => {
    const { scale, fontSize, padding } = useResponsive();
    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Text style={styles.backButtonText}>← Retour</Text>
                    </TouchableOpacity>
                )}

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={[styles.appName, { fontSize: scale(48) }]}>💪 ATHLIUM</Text>
                    <Text style={[styles.tagline, { fontSize: fontSize.lg }]}>
                        Ton guide anatomique pour la musculation
                    </Text>
                    <View style={styles.versionBadge}>
                        <Text style={styles.versionText}>Version 1.0.0</Text>
                    </View>
                </View>

                {/* Vision Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🎯 Ma Vision</Text>
                    <View style={styles.card}>
                        <Text style={styles.visionText}>
                            Athlium est né d’un constat simple : le sport devrait être accessible à tous,
                            sans barrières ni complications.
                        </Text>
                        <Text style={styles.visionText}>
                            En tant que passionné de musculation, je voulais une solution pour{' '}
                            <Text style={styles.highlight}>sortir de la routine</Text>, découvrir de nouveaux
                            exercices selon mes envies — sans passer des heures à chercher le bon mouvement.
                        </Text>
                        <Text style={styles.visionText}>
                            En explorant la <Text style={styles.highlight}>callisthénie</Text>, j’ai vite remarqué
                            que les ressources étaient souvent longues, floues, ou peu adaptées à ceux qui
                            s’entraînent avec peu de matériel.
                        </Text>
                        <Text style={styles.visionText}>
                            J’ai donc décidé de créer <Text style={styles.highlight}>l’outil que j’aurais aimé avoir</Text> :
                            une application simple, claire et intuitive, où tu trouves l’exercice qu’il te faut
                            en quelques clics.
                        </Text>
                        <Text style={styles.visionText}>
                            Athlium grandit avec toi. C’est un projet vivant, nourri par les retours et les idées
                            de sa communauté. Ensemble, on construit une app qui rend le sport plus accessible,
                            plus inspirant — et plus humain.
                        </Text>
                    </View>
                </View>

                {/* Philosophy Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>💡 Philosophie</Text>
                    <View style={styles.philosophyGrid}>
                        <View style={styles.philosophyCard}>
                            <Text style={styles.philosophyEmoji}>🎨</Text>
                            <Text style={styles.philosophyTitle}>Simplicité</Text>
                            <Text style={styles.philosophyText}>
                                Le sport ne devrait jamais être une usine à gaz. Une interface claire, des actions directes, et zéro perte de temps.
                            </Text>
                        </View>

                        <View style={styles.philosophyCard}>
                            <Text style={styles.philosophyEmoji}>🌍</Text>
                            <Text style={styles.philosophyTitle}>Accessibilité</Text>
                            <Text style={styles.philosophyText}>
                                Peu importe ton niveau ou ton équipement, tu dois pouvoir t’entraîner où que tu sois.
                            </Text>
                        </View>

                        <View style={styles.philosophyCard}>
                            <Text style={styles.philosophyEmoji}>🚀</Text>
                            <Text style={styles.philosophyTitle}>Évolution</Text>
                            <Text style={styles.philosophyText}>
                                Athlium avance pas à pas, avec l’aide de ceux qui l’utilisent. Chaque mise à jour est pensée pour te rapprocher de tes objectifs.
                            </Text>
                        </View>

                        <View style={styles.philosophyCard}>
                            <Text style={styles.philosophyEmoji}>🤝</Text>
                            <Text style={styles.philosophyTitle}>Communauté</Text>
                            <Text style={styles.philosophyText}>
                                L’idée, c’est de créer un espace où les passionnés s’entraident, partagent et se motivent mutuellement.
                            </Text>
                        </View>

                        <View style={styles.philosophyCard}>
                            <Text style={styles.philosophyEmoji}>🔥</Text>
                            <Text style={styles.philosophyTitle}>Motivation</Text>
                            <Text style={styles.philosophyText}>
                                Parce que s’entraîner doit rester un plaisir, Athlium intégrera peu à peu une touche de défi et de jeu —
                                pour que chaque séance devienne un accomplissement, pas une contrainte.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Features Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>✨ Ce que tu peux déjà faire</Text>
                    <View style={styles.card}>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🎯</Text>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Explorer l’anatomie et les exercices</Text>
                                <Text style={styles.featureText}>
                                    Découvre les muscles et les mouvements associés, en quelques gestes.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🔄</Text>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Sortir de la routine</Text>
                                <Text style={styles.featureText}>
                                    Laisse-toi surprendre par des suggestions d’exercices selon tes envies, ton humeur ou ton niveau.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🧠</Text>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Apprentissage visuel</Text>
                                <Text style={styles.featureText}>
                                    Comprends ce que tu travailles, muscle par muscle, grâce à une approche claire et intuitive.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>💬</Text>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Participer à l’évolution d’Athlium</Text>
                                <Text style={styles.featureText}>
                                    Tes retours sont précieux. Chaque idée compte pour faire grandir la plateforme.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Roadmap Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🗺️ Et la suite ?</Text>
                    <View style={styles.card}>
                        <Text style={styles.roadmapText}>
                            Athlium n’en est qu’à ses débuts. L’ambition est simple :
                            <Text style={styles.highlight}> ouvrir la porte à tous les sports</Text>,
                            et créer un espace où chacun peut progresser à son rythme, seul ou avec d’autres.
                        </Text>
                        <Text style={styles.roadmapText}>
                            De nouvelles fonctionnalités viendront peu à peu enrichir l’expérience :
                            certaines pour te motiver, d’autres pour te rapprocher des autres.
                        </Text>
                        <Text style={styles.roadmapText}>
                            Et pour le reste… je préfère garder un peu de mystère 😉
                        </Text>
                        <Text style={styles.roadmapText}>
                            Une chose est sûre : <Text style={styles.highlight}>Athlium continuera d’évoluer avec ceux qui l’utilisent.</Text>
                        </Text>
                    </View>
                </View>

                {/* Creator Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>👋 Un mot du créateur</Text>
                    <View style={styles.card}>
                        <Text style={styles.visionText}>
                            Salut 👋 Je m’appelle <Text style={styles.highlight}>Théo</Text>, passionné de sport, de callisthénie et de technologie.
                        </Text>
                        <Text style={styles.visionText}>
                            Athlium est un projet que je développe avec une idée en tête :
                            <Text style={styles.highlight}> aider chacun à s’entraîner simplement, efficacement, et avec plaisir.</Text>
                        </Text>
                        <Text style={styles.visionText}>
                            Ce n’est pas qu’une application, c’est une aventure collective.
                        </Text>
                        <Text style={styles.visionText}>
                            Merci de faire partie du début de cette histoire 💚
                        </Text>
                    </View>
                </View>

                {/* CTA Section */}
                {onComplete && (
                    <View style={styles.ctaSection}>
                        <Text style={styles.ctaTitle}>Prêt à commencer ? 🚀</Text>
                        <Text style={styles.ctaText}>
                            Explore le modèle 3D, découvre les exercices et commence ton parcours
                            vers tes objectifs fitness !
                        </Text>

                        <TouchableOpacity
                            style={styles.startButton}
                            onPress={onComplete}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.startButtonText}>Commencer l'aventure</Text>
                            <Text style={styles.startButtonIcon}>→</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Créé avec 💚 pour la communauté fitness</Text>
                    <Text style={styles.footerSubtext}>Merci de faire partie de l'aventure Athlium</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollView: { flex: 1 },
    scrollContent: { paddingTop: 20, paddingBottom: 40 },
    backButton: { paddingHorizontal: 20, paddingVertical: 10, marginBottom: 10 },
    backButtonText: { fontSize: 16, color: colors.accent, fontWeight: '600' },
    heroSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
        backgroundColor: colors.card,
        borderBottomWidth: 3,
        borderBottomColor: colors.accent,
    },
    appName: { fontWeight: 'bold', color: colors.text, marginBottom: 12, letterSpacing: 2 },
    tagline: { color: colors.textSecondary, textAlign: 'center', marginBottom: 20 },
    versionBadge: { backgroundColor: colors.accent, paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
    versionText: { fontSize: 14, fontWeight: '700', color: colors.background },
    section: { paddingHorizontal: 20, paddingVertical: 30 },
    sectionTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
    card: { backgroundColor: colors.card, borderRadius: 16, padding: 20, gap: 16 },
    visionText: { fontSize: 16, color: colors.text, lineHeight: 26 },
    highlight: { color: colors.accent, fontWeight: '600' },
    philosophyGrid: { gap: 12 },
    philosophyCard: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    philosophyEmoji: { fontSize: 40, marginBottom: 12 },
    philosophyTitle: { fontSize: 18, fontWeight: '700', color: colors.accent, marginBottom: 8 },
    philosophyText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
    featureItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
    featureIcon: { fontSize: 32 },
    featureContent: { flex: 1 },
    featureTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 4 },
    featureText: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
    roadmapText: { fontSize: 16, color: colors.text, lineHeight: 24, marginBottom: 8 },
    ctaSection: { paddingHorizontal: 20, paddingVertical: 40, alignItems: 'center' },
    ctaTitle: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 16, textAlign: 'center' },
    ctaText: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: 32, paddingHorizontal: 10 },
    startButton: {
        backgroundColor: colors.accent,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 30,
        gap: 12,
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    startButtonText: { fontSize: 18, fontWeight: '700', color: colors.background },
    startButtonIcon: { fontSize: 24, color: colors.background, fontWeight: 'bold' },
    footer: { alignItems: 'center', paddingHorizontal: 20, paddingVertical: 30 },
    footerText: { fontSize: 16, fontWeight: '600', color: colors.accent, marginBottom: 8, textAlign: 'center' },
    footerSubtext: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
});

export default WelcomeScreen;
