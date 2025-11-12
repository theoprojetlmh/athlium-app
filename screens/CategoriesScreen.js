import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { COLORS } from '../constants/colors';
import { useResponsive } from '../hooks/useResponsive';

const CategoriesScreen = ({ navigation }) => {
    const { fontSize, padding, scale } = useResponsive();

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
            <ScrollView contentContainerStyle={[styles.scrollContent, { padding: padding.md }]}>
                <Text style={[styles.title, { fontSize: fontSize.xxxl }]}>Explorer les exercices</Text>
                <Text style={[styles.subtitle, { fontSize: fontSize.md, marginBottom: padding.lg }]}>
                    Choisissez votre type d'entraînement
                </Text>

                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[styles.categoryCard, {
                            borderColor: category.color,
                            padding: padding.md,
                            marginBottom: padding.sm
                        }]}
                        onPress={() => handleCategoryPress(category.id)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.categoryIcon, { fontSize: scale(40) }]}>{category.icon}</Text>
                        <View style={styles.categoryInfo}>
                            <Text style={[styles.categoryTitle, { fontSize: fontSize.xl }]}>{category.title}</Text>
                            <Text style={[styles.categorySubtitle, { fontSize: fontSize.sm }]}>{category.subtitle}</Text>
                        </View>
                        <Text style={[styles.arrow, { fontSize: fontSize.xxl }]}>→</Text>
                    </TouchableOpacity>
                ))}

                <View style={[styles.divider, { marginVertical: padding.lg }]}>
                    <View style={styles.dividerLine} />
                    <Text style={[styles.dividerText, { fontSize: fontSize.sm, marginHorizontal: padding.sm }]}>OU</Text>
                    <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                    style={[styles.modelButton, {
                        padding: padding.md,
                        borderColor: COLORS.accent
                    }]}
                    onPress={() => navigation.navigate('Home')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.modelIcon, { fontSize: scale(40) }]}>🧘</Text>
                    <View style={styles.categoryInfo}>
                        <Text style={[styles.categoryTitle, { fontSize: fontSize.xl }]}>Modèle 3D</Text>
                        <Text style={[styles.categorySubtitle, { fontSize: fontSize.sm }]}>Explorer par muscle</Text>
                    </View>
                    <Text style={[styles.arrow, { fontSize: fontSize.xxl }]}>→</Text>
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
        // padding géré dynamiquement
    },
    title: {
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    subtitle: {
        color: COLORS.textSecondary,
        // fontSize et marginBottom gérés dynamiquement
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundCard,
        borderRadius: 15,
        borderWidth: 2,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    categoryIcon: {
        marginRight: 15,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryTitle: {
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    categorySubtitle: {
        color: COLORS.textSecondary,
    },
    arrow: {
        color: COLORS.text,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.textSecondary,
        opacity: 0.3,
    },
    dividerText: {
        color: COLORS.textSecondary,
        fontWeight: 'bold',
    },
    modelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundCard,
        borderRadius: 15,
        borderWidth: 2,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    modelIcon: {
        marginRight: 15,
    },
});

export default CategoriesScreen;