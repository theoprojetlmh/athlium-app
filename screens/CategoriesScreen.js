import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { COLORS } from '../constants/colors';

const CategoriesScreen = ({ navigation }) => {
    const categories = [
        {
            id: 'equipment',
            title: 'Avec Matériel',
            subtitle: 'Salle & Équipement',
            icon: '🏋️',
            color: COLORS.primary,
        },
        {
            id: 'calisthenics',
            title: 'Callisthénie',
            subtitle: 'Poids du corps',
            icon: '🤸',
            color: COLORS.secondary,
        },
        {
            id: 'cardio',
            title: 'Cardio',
            subtitle: 'Haute intensité',
            icon: '🔥',
            color: COLORS.accent,
        },
    ];

    const handleCategoryPress = (categoryId) => {
        navigation.navigate('ExercisesList', { category: categoryId });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Explorer les exercices</Text>
                <Text style={styles.subtitle}>Choisissez votre type d'entraînement</Text>

                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[styles.categoryCard, { borderColor: category.color }]}
                        onPress={() => handleCategoryPress(category.id)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.categoryIcon}>{category.icon}</Text>
                        <View style={styles.categoryInfo}>
                            <Text style={styles.categoryTitle}>{category.title}</Text>
                            <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                        </View>
                        <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>
                ))}

                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OU</Text>
                    <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                    style={styles.modelButton}
                    onPress={() => navigation.navigate('Home')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.modelIcon}>🧘</Text>
                    <View style={styles.categoryInfo}>
                        <Text style={styles.categoryTitle}>Modèle 3D</Text>
                        <Text style={styles.categorySubtitle}>Explorer par muscle</Text>
                    </View>
                    <Text style={styles.arrow}>→</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 30,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundCard,
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        borderWidth: 2,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    categoryIcon: {
        fontSize: 40,
        marginRight: 15,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    categorySubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    arrow: {
        fontSize: 24,
        color: COLORS.text,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
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
    modelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundCard,
        padding: 20,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: COLORS.accent,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    modelIcon: {
        fontSize: 40,
        marginRight: 15,
    },
});

export default CategoriesScreen;