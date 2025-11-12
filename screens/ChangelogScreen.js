// screens/ChangelogScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { colors } from '../constants/colors';
import { supabase } from '../lib/supabase';
import { useResponsive } from '../hooks/useResponsive';

const ChangeTypeIcon = ({ type }) => {
    const icons = {
        added: '➕',
        fixed: '🔧',
        improved: '⚡',
        removed: '❌'
    };

    const labels = {
        added: 'AJOUT',
        fixed: 'CORRECTION',
        improved: 'AMÉLIORATION',
        removed: 'SUPPRESSION'
    };

    return (
        <View style={styles.typeContainer}>
            <Text style={styles.typeIcon}>{icons[type]}</Text>
            <Text style={[styles.typeLabel, styles[`type_${type}`]]}>
                {labels[type]}
            </Text>
        </View>
    );
};

const ChangelogScreen = ({ onBack }) => {
    const { scale, fontSize } = useResponsive();
    const [changelogs, setChangelogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Charger les changelogs depuis Supabase
    const fetchChangelogs = async () => {
        try {
            const { data, error } = await supabase
                .from('changelogs')
                .select('*')
                .order('display_order', { ascending: false });

            if (error) throw error;

            // Formater les dates
            const formattedData = data.map(item => ({
                ...item,
                // Convertir la date en format français
                date: new Date(item.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })
            }));

            setChangelogs(formattedData);
            setError(null);
        } catch (err) {
            console.error('Erreur chargement changelogs:', err);
            setError('Impossible de charger les notes de version');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchChangelogs();
    }, []);

    // Pull-to-refresh
    const onRefresh = () => {
        setRefreshing(true);
        fetchChangelogs();
    };

    // Affichage pendant le chargement initial
    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    {onBack && (
                        <TouchableOpacity onPress={onBack} style={styles.backButton}>
                            <Text style={styles.backButtonText}>← Retour</Text>
                        </TouchableOpacity>
                    )}
                    <Text style={styles.headerTitle}>📋 Notes de Version</Text>
                    <Text style={styles.headerSubtitle}>Historique des mises à jour d'Athlium</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.accent} />
                    <Text style={styles.loadingText}>Chargement...</Text>
                </View>
            </View>
        );
    }

    // Affichage en cas d'erreur
    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    {onBack && (
                        <TouchableOpacity onPress={onBack} style={styles.backButton}>
                            <Text style={styles.backButtonText}>← Retour</Text>
                        </TouchableOpacity>
                    )}
                    <Text style={styles.headerTitle}>📋 Notes de Version</Text>
                    <Text style={styles.headerSubtitle}>Historique des mises à jour d'Athlium</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorIcon}>⚠️</Text>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchChangelogs}>
                        <Text style={styles.retryButtonText}>🔄 Réessayer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Text style={styles.backButtonText}>← Retour</Text>
                    </TouchableOpacity>
                )}
                <Text style={styles.headerTitle}>📋 Notes de Version</Text>
                <Text style={styles.headerSubtitle}>
                    Historique des mises à jour d'Athlium
                </Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.accent}
                        colors={[colors.accent]}
                    />
                }
            >
                {changelogs.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>🔭</Text>
                        <Text style={styles.emptyText}>Aucune mise à jour pour le moment</Text>
                    </View>
                ) : (
                    <>
                        {changelogs.map((version, versionIndex) => (
                            <View key={version.id} style={styles.versionBlock}>
                                {/* En-tête de version */}
                                <View style={styles.versionHeader}>
                                    <View style={styles.versionTitleRow}>
                                        <Text style={[styles.versionEmoji, { fontSize: scale(40) }]}>{version.emoji}</Text>
                                        <View style={styles.versionInfo}>
                                            <Text style={styles.versionNumber}>
                                                Version {version.version}
                                            </Text>
                                            <Text style={styles.versionTitle}>
                                                {version.title}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.versionDate}>{version.date}</Text>
                                </View>

                                {/* Liste des changements */}
                                <View style={styles.changesList}>
                                    {version.changes.map((change, changeIndex) => (
                                        <View key={changeIndex} style={styles.changeItem}>
                                            <ChangeTypeIcon type={change.type} />
                                            <Text style={styles.changeText}>{change.text}</Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Séparateur entre versions (sauf pour la dernière) */}
                                {versionIndex < changelogs.length - 1 && (
                                    <View style={styles.versionSeparator} />
                                )}
                            </View>
                        ))}

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                🚀 D'autres mises à jour arrivent bientôt !
                            </Text>
                            <Text style={styles.footerSubtext}>
                                Merci de faire partie de l'aventure Athlium
                            </Text>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        marginBottom: 20,
    },
    backButtonText: {
        fontSize: 16,
        color: colors.accent,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        color: colors.textSecondary,
        fontSize: 16,
        marginTop: 15,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    errorIcon: {
        fontSize: 60,
        marginBottom: 20,
    },
    errorText: {
        color: colors.textSecondary,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
    },
    retryButton: {
        backgroundColor: colors.accent,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 10,
    },
    retryButtonText: {
        color: colors.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: 20,
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    versionBlock: {
        marginBottom: 30,
    },
    versionHeader: {
        marginBottom: 20,
    },
    versionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    versionEmoji: {
        marginRight: 15,
    },
    versionInfo: {
        flex: 1,
    },
    versionNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.accent,
        marginBottom: 4,
    },
    versionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    versionDate: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 4,
    },
    changesList: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        gap: 16,
    },
    changeItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        backgroundColor: colors.background,
        minWidth: 130,
    },
    typeIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    typeLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    type_added: {
        color: colors.accent,
    },
    type_fixed: {
        color: '#FFA500',
    },
    type_improved: {
        color: '#00D9FF',
    },
    type_removed: {
        color: '#FF5555',
    },
    changeText: {
        flex: 1,
        fontSize: 15,
        color: colors.text,
        lineHeight: 22,
    },
    versionSeparator: {
        height: 1,
        backgroundColor: colors.border,
        marginTop: 30,
        marginHorizontal: 20,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    footerText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.accent,
        marginBottom: 8,
        textAlign: 'center',
    },
    footerSubtext: {
        fontSize: 13,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});

export default ChangelogScreen;