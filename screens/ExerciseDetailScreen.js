import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { COLORS } from '../constants/colors';
import { useResponsive } from '../hooks/useResponsive';

const ExerciseDetailScreen = ({ route, navigation }) => {
    const { fontSize, padding, scale } = useResponsive();
    const { exerciseId } = route.params || {};
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (exerciseId) {
            fetchExercise();
        } else {
            setError('ID exercice manquant');
            setLoading(false);
        }
    }, [exerciseId]);

    const fetchExercise = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔍 Chargement exercice ID:', exerciseId);

            const { data, error: fetchError } = await supabase
                .from('exercises')
                .select('*')
                .eq('id', exerciseId)
                .single();

            if (fetchError) throw fetchError;

            console.log('✅ Exercice récupéré:', data);

            if (!data) {
                throw new Error('Exercice introuvable');
            }

            setExercise(data);
        } catch (err) {
            console.error('❌ Erreur chargement exercice:', err);
            setError(err.message || 'Erreur de chargement');
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyDisplay = (difficulty) => {
        const levels = {
            beginner: { text: 'Débutant', stars: '⭐', color: COLORS.beginner },
            intermediate: { text: 'Intermédiaire', stars: '⭐⭐', color: COLORS.intermediate },
            advanced: { text: 'Avancé', stars: '⭐⭐⭐', color: COLORS.advanced },
        };
        return levels[difficulty] || { text: difficulty, stars: '⭐', color: COLORS.text };
    };

    const getCategoryIcon = (category) => {
        const icons = {
            equipment: '🏋️',
            calisthenics: '🤸',
            cardio: '🔥',
        };
        return icons[category] || '📋';
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={COLORS.accent} />
                    <Text style={[styles.loadingText, { fontSize: fontSize.md }]}>Chargement de l'exercice...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !exercise) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <Text style={[styles.errorIcon, { fontSize: scale(60) }]}>❌</Text>
                    <Text style={[styles.errorText, { fontSize: fontSize.lg }]}>{error || 'Exercice introuvable'}</Text>
                    <TouchableOpacity
                        style={[styles.retryButton, { paddingHorizontal: padding.lg, paddingVertical: padding.xs }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={[styles.retryButtonText, { fontSize: fontSize.md }]}>← Retour</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const difficultyInfo = getDifficultyDisplay(exercise.difficulty);

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView style={styles.scrollView}>
                {exercise.video_url ? (
                    <View style={styles.mediaContainer}>
                        <Image
                            source={{ uri: exercise.video_url }}
                            style={styles.video}
                            resizeMode="cover"
                        />
                        <View style={[styles.videoOverlay, { paddingHorizontal: padding.xs, paddingVertical: padding.xs / 2 }]}>
                            <Text style={[styles.videoLabel, { fontSize: fontSize.xs }]}>🎥 Vidéo</Text>
                        </View>
                    </View>
                ) : exercise.image_url ? (
                    <View style={styles.mediaContainer}>
                        <Image
                            source={{ uri: exercise.image_url }}
                            style={styles.video}
                            resizeMode="cover"
                        />
                    </View>
                ) : (
                    <View style={[styles.mediaContainer, styles.noMedia]}>
                        <Text style={[styles.noMediaIcon, { fontSize: scale(80) }]}>💪</Text>
                        <Text style={[styles.noMediaText, { fontSize: fontSize.md }]}>Média bientôt disponible</Text>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={[styles.backButtonText, { fontSize: fontSize.xxl }]}>←</Text>
                </TouchableOpacity>

                <View style={[styles.content, { padding: padding.md }]}>
                    <Text style={[styles.title, { fontSize: fontSize.xxxl }]}>{exercise.name}</Text>

                    <View style={styles.tagsContainer}>
                        <View style={[styles.tag, { borderColor: difficultyInfo.color, paddingHorizontal: padding.sm, paddingVertical: padding.xs }]}>
                            <Text style={[styles.tagText, { color: difficultyInfo.color, fontSize: fontSize.sm }]}>
                                {difficultyInfo.stars} {difficultyInfo.text}
                            </Text>
                        </View>

                        {exercise.category && (
                            <View style={[styles.tag, { paddingHorizontal: padding.sm, paddingVertical: padding.xs }]}>
                                <Text style={[styles.tagText, { fontSize: fontSize.sm }]}>
                                    {getCategoryIcon(exercise.category)} {exercise.category}
                                </Text>
                            </View>
                        )}

                        {exercise.equipment && (
                            <View style={[styles.tag, { paddingHorizontal: padding.sm, paddingVertical: padding.xs }]}>
                                <Text style={[styles.tagText, { fontSize: fontSize.sm }]}>📦 {exercise.equipment}</Text>
                            </View>
                        )}
                    </View>

                    {exercise.description && (
                        <View style={[styles.section, { marginBottom: padding.lg }]}>
                            <Text style={[styles.sectionTitle, { fontSize: fontSize.xl, marginBottom: padding.xs }]}>📖 Description</Text>
                            <Text style={[styles.sectionText, { fontSize: fontSize.md }]}>{exercise.description}</Text>
                        </View>
                    )}

                    {exercise.instructions && exercise.instructions !== exercise.description && (
                        <View style={[styles.section, { marginBottom: padding.lg }]}>
                            <Text style={[styles.sectionTitle, { fontSize: fontSize.xl, marginBottom: padding.xs }]}>📝 Instructions</Text>
                            <Text style={[styles.sectionText, { fontSize: fontSize.md }]}>{exercise.instructions}</Text>
                        </View>
                    )}

                    <View style={{ height: 40 }} />
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        color: COLORS.text,
        marginTop: 15,
    },
    errorIcon: {
        marginBottom: 20,
    },
    errorText: {
        color: COLORS.error,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
    },
    retryButtonText: {
        color: COLORS.text,
        fontWeight: 'bold',
    },
    mediaContainer: {
        width: '100%',
        height: 300,
        backgroundColor: COLORS.backgroundCard,
        position: 'relative',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    noMedia: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    noMediaIcon: {
        marginBottom: 10,
    },
    noMediaText: {
        color: COLORS.textSecondary,
    },
    videoOverlay: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 8,
    },
    videoLabel: {
        color: COLORS.text,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        width: 45,
        height: 45,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    backButtonText: {
        color: COLORS.text,
        fontWeight: 'bold',
    },
    content: {
        // padding géré dynamiquement
    },
    title: {
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 15,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    tag: {
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    tagText: {
        color: COLORS.text,
        fontWeight: '600',
    },
    section: {
        // marginBottom géré dynamiquement
    },
    sectionTitle: {
        fontWeight: 'bold',
        color: COLORS.accent,
        // marginBottom géré dynamiquement
    },
    sectionText: {
        color: COLORS.text,
        lineHeight: 24,
    },
});

export default ExerciseDetailScreen;