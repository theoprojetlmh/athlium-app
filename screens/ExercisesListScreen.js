import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { COLORS } from '../constants/colors';
import { useResponsive } from '../hooks/useResponsive';

const ExercisesListScreen = ({ route, navigation }) => {
    const { fontSize, padding, scale } = useResponsive();
    const { category, muscle, muscleName } = route.params;
    const [allExercises, setAllExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);

    const categoryTitles = {
        all: 'Tous',
        equipment: 'Avec Matériel',
        calisthenics: 'Callisthénie',
        cardio: 'Cardio',
    };

    const categoryIcons = {
        all: '📋',
        equipment: '🏋️',
        calisthenics: '🤸',
        cardio: '🔥',
    };

    useEffect(() => {
        fetchExercises();
    }, [category, muscle]);

    useEffect(() => {
        applyFilter();
    }, [selectedFilter, allExercises]);

    const fetchExercises = async () => {
        try {
            setLoading(true);
            console.log('🔍 Chargement exercices - category:', category, 'muscle:', muscle);

            let query = supabase.from('exercises').select('*');

            if (category) {
                query = query.eq('category', category);
            } else if (muscle) {
                const { data: muscleData, error: muscleError } = await supabase
                    .from('muscles')
                    .select('id')
                    .eq('slug', muscle)
                    .single();

                if (muscleError) throw muscleError;

                // ✅ Filtrer UNIQUEMENT les muscles primaires
                const { data: exerciseIds, error: relError } = await supabase
                    .from('muscle_exercises')
                    .select('exercise_id')
                    .eq('muscle_id', muscleData.id)
                    .eq('is_primary', true);

                if (relError) throw relError;

                const ids = exerciseIds.map(e => e.exercise_id);
                query = query.in('id', ids);
            }

            query = query.order('name');
            const { data, error } = await query;

            if (error) throw error;

            console.log('✅ Exercices récupérés:', data?.length || 0);
            setAllExercises(data || []);
        } catch (error) {
            console.error('❌ Erreur chargement exercices:', error);
            setAllExercises([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = () => {
        if (selectedFilter === 'all') {
            setFilteredExercises(allExercises);
        } else {
            setFilteredExercises(allExercises.filter(ex => ex.category === selectedFilter));
        }
    };

    // Compter les exercices par catégorie
    const getCategoryCount = (categoryKey) => {
        if (categoryKey === 'all') {
            return allExercises.length;
        }
        return allExercises.filter(ex => ex.category === categoryKey).length;
    };

    const getTitle = () => {
        if (muscle && muscleName) {
            return `💪 ${muscleName.replace(/-/g, ' ').toUpperCase()}`;
        }
        return categoryTitles[category] || 'Exercices';
    };

    const getDifficultyDisplay = (difficulty) => {
        const levels = {
            beginner: { text: 'Débutant', stars: '⭐', color: COLORS.success },
            intermediate: { text: 'Intermédiaire', stars: '⭐⭐', color: COLORS.warning },
            advanced: { text: 'Avancé', stars: '⭐⭐⭐', color: COLORS.error },
        };
        return levels[difficulty] || { text: difficulty, stars: '⭐', color: COLORS.textSecondary };
    };

    const getCategoryLabel = (cat) => {
        const labels = {
            equipment: 'Avec Matériel',
            calisthenics: 'Callisthénie',
            cardio: 'Cardio',
        };
        return labels[cat] || cat;
    };

    const handleFilterSelect = (filterKey) => {
        setSelectedFilter(filterKey);
        setFilterMenuOpen(false);
    };

    const renderExercise = ({ item, index }) => {
        const difficultyInfo = getDifficultyDisplay(item.difficulty);
        const categoryLabel = getCategoryLabel(item.category);

        return (
            <TouchableOpacity
                style={[
                    styles.exerciseCard,
                    index % 2 === 0 ? styles.cardLeft : styles.cardRight
                ]}
                onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: item.id })}
                activeOpacity={0.7}
            >
                {/* Image de l'exercice (placeholder si pas d'image) */}
                <View style={styles.imageContainer}>
                    {item.image_url ? (
                        <Image
                            source={{ uri: item.image_url }}
                            style={styles.exerciseImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={[styles.placeholderIcon, { fontSize: scale(40) }]}>💪</Text>
                            <Text style={[styles.placeholderText, { fontSize: fontSize.xs }]}>Bientôt disponible</Text>
                        </View>
                    )}
                </View>

                {/* Barre d'infos en bas */}
                <View style={[styles.infoBar, { padding: padding.xs }]}>
                    <Text style={[styles.exerciseName, { fontSize: fontSize.sm }]} numberOfLines={2}>
                        {item.name}
                    </Text>

                    <View style={styles.detailsRow}>
                        <View style={styles.difficultyBadge}>
                            <Text style={[styles.difficultyText, { color: difficultyInfo.color, fontSize: fontSize.xs }]}>
                                {difficultyInfo.stars}
                            </Text>
                        </View>

                        <Text style={[styles.categoryText, { fontSize: fontSize.xs }]} numberOfLines={1}>
                            {categoryLabel}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.accent} />
                <Text style={[styles.loadingText, { fontSize: fontSize.md }]}>Chargement des exercices...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, { padding: padding.md }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={[styles.backButtonText, { fontSize: fontSize.md }]}>← Retour</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { fontSize: fontSize.xxxl }]}>{getTitle()}</Text>

                <View style={styles.headerRow}>
                    <Text style={[styles.count, { fontSize: fontSize.sm }]}>
                        {filteredExercises.length} exercice{filteredExercises.length > 1 ? 's' : ''}
                    </Text>

                    {/* Bouton Exercice Aléatoire */}
                    {filteredExercises.length > 0 && (
                        <TouchableOpacity
                            style={[styles.randomButton, { paddingHorizontal: padding.sm, paddingVertical: padding.xs }]}
                            onPress={() => {
                                const randomIndex = Math.floor(Math.random() * filteredExercises.length);
                                const randomExercise = filteredExercises[randomIndex];
                                navigation.navigate('ExerciseDetail', { exerciseId: randomExercise.id });
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.randomButtonIcon, { fontSize: fontSize.lg }]}>🎲</Text>
                            <Text style={[styles.randomButtonText, { fontSize: fontSize.sm }]}>Aléatoire</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Menu déroulant de filtres */}
                {muscle && (
                    <View style={[styles.filterContainer, { marginTop: padding.sm }]}>
                        <TouchableOpacity
                            style={[styles.filterHeader, { padding: padding.sm }]}
                            onPress={() => setFilterMenuOpen(!filterMenuOpen)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.filterHeaderText, { fontSize: fontSize.md }]}>
                                Filtrer : {categoryTitles[selectedFilter]}
                            </Text>
                            <Text style={[styles.filterHeaderIcon, { fontSize: fontSize.sm }]}>
                                {filterMenuOpen ? '▲' : '▼'}
                            </Text>
                        </TouchableOpacity>

                        {filterMenuOpen && (
                            <View style={styles.filterDropdown}>
                                {Object.entries(categoryTitles).map(([key, label]) => {
                                    const count = getCategoryCount(key);
                                    return (
                                        <TouchableOpacity
                                            key={key}
                                            style={[
                                                styles.filterOption,
                                                { padding: padding.sm },
                                                selectedFilter === key && styles.filterOptionSelected
                                            ]}
                                            onPress={() => handleFilterSelect(key)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[styles.filterOptionIcon, { fontSize: fontSize.xl }]}>
                                                {categoryIcons[key]}
                                            </Text>

                                            <View style={styles.filterOptionContent}>
                                                <Text style={[
                                                    styles.filterOptionText,
                                                    { fontSize: fontSize.md },
                                                    selectedFilter === key && styles.filterOptionTextSelected
                                                ]}>
                                                    {label}
                                                </Text>
                                                <Text style={[styles.filterOptionCount, { fontSize: fontSize.xs }]}>
                                                    {count} exercice{count > 1 ? 's' : ''}
                                                </Text>
                                            </View>

                                            {selectedFilter === key && (
                                                <Text style={[styles.checkmark, { fontSize: fontSize.lg }]}>✓</Text>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                )}
            </View>

            {filteredExercises.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={[styles.emptyIcon, { fontSize: scale(60) }]}>🤷</Text>
                    <Text style={[styles.emptyText, { fontSize: fontSize.lg }]}>Aucun exercice trouvé</Text>
                    {muscle && (
                        <TouchableOpacity
                            style={[styles.resetButton, { paddingHorizontal: padding.md, paddingVertical: padding.xs }]}
                            onPress={() => setSelectedFilter('all')}
                        >
                            <Text style={[styles.resetButtonText, { fontSize: fontSize.sm }]}>Voir tous les exercices</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <FlatList
                    data={filteredExercises}
                    renderItem={renderExercise}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={[styles.list, { padding: padding.xs }]}
                    columnWrapperStyle={styles.row}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.backgroundCard,
    },
    backButton: {
        marginBottom: 15,
    },
    backButtonText: {
        color: COLORS.accent,
        fontWeight: '600',
    },
    title: {
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    count: {
        color: COLORS.textSecondary,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    randomButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.accent,
    },
    randomButtonIcon: {
        marginRight: 6,
    },
    randomButtonText: {
        color: COLORS.text,
        fontWeight: 'bold',
    },
    list: {
        // padding géré dynamiquement
    },
    row: {
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    exerciseCard: {
        backgroundColor: COLORS.backgroundCard,
        borderRadius: 16,
        marginBottom: 15,
        overflow: 'hidden',
        width: '48%',
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardLeft: {
        marginRight: 5,
    },
    cardRight: {
        marginLeft: 5,
    },
    imageContainer: {
        width: '100%',
        height: 140,
        backgroundColor: COLORS.background,
    },
    exerciseImage: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primaryDark,
    },
    placeholderIcon: {
        marginBottom: 5,
    },
    placeholderText: {
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    infoBar: {
        backgroundColor: COLORS.backgroundCard,
    },
    exerciseName: {
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
        minHeight: 36,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    difficultyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    difficultyText: {
        fontWeight: '600',
    },
    categoryText: {
        color: COLORS.textSecondary,
        fontWeight: '500',
        maxWidth: '60%',
    },
    loadingText: {
        color: COLORS.text,
        marginTop: 10,
    },
    emptyIcon: {
        marginBottom: 20,
    },
    emptyText: {
        color: COLORS.text,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    resetButton: {
        marginTop: 15,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
    },
    resetButtonText: {
        color: COLORS.text,
        fontWeight: 'bold',
    },
    // Styles menu déroulant
    filterContainer: {
        // marginTop géré dynamiquement
    },
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundCard,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    filterHeaderText: {
        fontWeight: 'bold',
        color: COLORS.text,
    },
    filterHeaderIcon: {
        color: COLORS.accent,
        fontWeight: 'bold',
    },
    filterDropdown: {
        marginTop: 8,
        backgroundColor: COLORS.backgroundCard,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    filterOption: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background,
    },
    filterOptionSelected: {
        backgroundColor: COLORS.primaryDark,
    },
    filterOptionIcon: {
        marginRight: 12,
    },
    filterOptionContent: {
        flex: 1,
    },
    filterOptionText: {
        color: COLORS.text,
        fontWeight: '500',
    },
    filterOptionTextSelected: {
        color: COLORS.accent,
        fontWeight: 'bold',
    },
    filterOptionCount: {
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    checkmark: {
        color: COLORS.accent,
        fontWeight: 'bold',
    },
});

export default ExercisesListScreen;