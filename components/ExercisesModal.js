import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { COLORS } from '../constants/colors';

const ExercisesModal = ({ isVisible, onClose, muscleName, exercises, loading, navigation }) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection="down"
            style={styles.modal}
            backdropOpacity={0.7}
            animationIn="slideInUp"
            animationOut="slideOutDown"
        >
            <View style={styles.modalContent}>
                {/* Header avec barre de drag */}
                <View style={styles.dragBar} />

                <Text style={styles.title}>
                    💪 {muscleName ? muscleName.replace(/-/g, ' ').toUpperCase() : 'MUSCLE'}
                </Text>

                <Text style={styles.subtitle}>
                    {exercises.length} exercice{exercises.length > 1 ? 's' : ''} disponible{exercises.length > 1 ? 's' : ''}
                </Text>

                {/* Liste des exercices */}
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {loading ? (
                        <Text style={styles.loadingText}>Chargement des exercices...</Text>
                    ) : exercises.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Aucun exercice trouvé</Text>
                            <Text style={styles.emptySubtext}>
                                Ce muscle n'a pas encore d'exercices associés
                            </Text>
                        </View>
                    ) : (
                        exercises.map((exercise, index) => (
                            <TouchableOpacity
                                key={exercise.id || index}
                                style={styles.exerciseCard}
                                onPress={() => {
                                    onClose(); // Fermer la modale
                                    navigation.navigate('ExerciseDetail', { exercise }); // Naviguer vers le détail
                                }}
                                activeOpacity={0.8}
                            >
                                {/* Nom de l'exercice */}
                                <Text style={styles.exerciseName}>{exercise.name}</Text>

                                {/* Difficulté */}
                                <View style={styles.infoRow}>
                                    <Text style={styles.difficultyBadge}>
                                        {exercise.difficulty === 'beginner' && '🟢 Débutant'}
                                        {exercise.difficulty === 'intermediate' && '🟡 Intermédiaire'}
                                        {exercise.difficulty === 'advanced' && '🔴 Avancé'}
                                    </Text>
                                </View>

                                {/* Type de muscle */}
                                <View style={styles.infoRow}>
                                    <Text style={styles.muscleType}>
                                        {exercise.is_primary ? '⭐ Muscle principal' : '💡 Muscle secondaire'}
                                    </Text>
                                </View>

                                {/* Équipement */}
                                {exercise.equipment && (
                                    <Text style={styles.equipment}>
                                        🏋️ {exercise.equipment}
                                    </Text>
                                )}

                                {/* Description */}
                                {exercise.description && (
                                    <Text style={styles.description} numberOfLines={2}>
                                        {exercise.description}
                                    </Text>
                                )}

                                {/* Indicateur cliquable */}
                                <View style={styles.clickIndicator}>
                                    <Text style={styles.clickIndicatorText}>Voir les détails →</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>

                {/* Bouton fermer */}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 12,
        paddingHorizontal: 20,
        paddingBottom: 34,
        maxHeight: '80%',
    },
    dragBar: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.accent,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.accent,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 20,
        opacity: 0.8,
    },
    scrollView: {
        maxHeight: 400,
    },
    loadingText: {
        color: COLORS.text,
        textAlign: 'center',
        fontSize: 16,
        marginVertical: 40,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptySubtext: {
        color: COLORS.text,
        fontSize: 14,
        opacity: 0.6,
        textAlign: 'center',
    },
    exerciseCard: {
        backgroundColor: COLORS.backgroundCard,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.accent,
    },
    exerciseName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    infoRow: {
        marginBottom: 6,
    },
    difficultyBadge: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '600',
    },
    muscleType: {
        fontSize: 13,
        color: COLORS.text,
        opacity: 0.9,
    },
    equipment: {
        fontSize: 13,
        color: COLORS.text,
        marginTop: 4,
        opacity: 0.8,
    },
    description: {
        fontSize: 13,
        color: COLORS.text,
        marginTop: 8,
        lineHeight: 18,
        opacity: 0.7,
    },
    closeButton: {
        backgroundColor: COLORS.secondary,
        borderRadius: 12,
        paddingVertical: 14,
        marginTop: 16,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    clickIndicator: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.accent,
        alignItems: 'flex-end',
    },
    clickIndicatorText: {
        color: COLORS.accent,
        fontSize: 13,
        fontWeight: 'bold',
    },
});

export default ExercisesModal;