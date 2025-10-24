import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { COLORS } from '../constants/colors';

const ExerciseDetailScreen = ({ route, navigation }) => {
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
                    <Text style={styles.loadingText}>Chargement de l'exercice...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !exercise) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <Text style={styles.errorIcon}>❌</Text>
                    <Text style={styles.errorText}>{error || 'Exercice introuvable'}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.retryButtonText}>← Retour</Text>
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
                        <View style={styles.videoOverlay}>
                            <Text style={styles.videoLabel}>🎥 Vidéo</Text>
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
                        <Text style={styles.noMediaIcon}>💪</Text>
                        <Text style={styles.noMediaText}>Média bientôt disponible</Text>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>

                <View style={styles.content}>
                    <Text style={styles.title}>{exercise.name}</Text>

                    <View style={styles.tagsContainer}>
                        <View style={[styles.tag, { borderColor: difficultyInfo.color }]}>
                            <Text style={[styles.tagText, { color: difficultyInfo.color }]}>
                                {difficultyInfo.stars} {difficultyInfo.text}
                            </Text>
                        </View>

                        {exercise.category && (
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>
                                    {getCategoryIcon(exercise.category)} {exercise.category}
                                </Text>
                            </View>
                        )}

                        {exercise.equipment && (
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>📦 {exercise.equipment}</Text>
                            </View>
                        )}
                    </View>

                    {exercise.description && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>📖 Description</Text>
                            <Text style={styles.sectionText}>{exercise.description}</Text>
                        </View>
                    )}

                    {exercise.instructions && exercise.instructions !== exercise.description && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>📝 Instructions</Text>
                            <Text style={styles.sectionText}>{exercise.instructions}</Text>
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
        fontSize: 16,
        marginTop: 15,
    },
    errorIcon: {
        fontSize: 60,
        marginBottom: 20,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 10,
    },
    retryButtonText: {
        color: COLORS.text,
        fontSize: 16,
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
        fontSize: 80,
        marginBottom: 10,
    },
    noMediaText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
    videoOverlay: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    videoLabel: {
        color: COLORS.text,
        fontSize: 12,
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
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
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
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        marginBottom: 10,
    },
    tagText: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600',
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.accent,
        marginBottom: 10,
    },
    sectionText: {
        fontSize: 16,
        color: COLORS.text,
        lineHeight: 24,
    },
});

export default ExerciseDetailScreen;