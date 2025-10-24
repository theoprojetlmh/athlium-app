import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { COLORS } from '../constants/colors';

const FeedbackScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [type, setType] = useState('suggestion');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const feedbackTypes = [
        { id: 'bug', label: '🐛 Bug', description: 'Signaler un problème' },
        { id: 'suggestion', label: '💡 Suggestion', description: 'Proposer une amélioration' },
        { id: 'autre', label: '💬 Autre', description: 'Autre commentaire' },
    ];

    const handleSubmit = async () => {
        // Validation
        if (!message.trim()) {
            Alert.alert('Message requis', 'Veuillez écrire un message avant d\'envoyer.');
            return;
        }

        if (message.trim().length < 10) {
            Alert.alert('Message trop court', 'Veuillez écrire au moins 10 caractères.');
            return;
        }

        try {
            setLoading(true);

            const { error } = await supabase
                .from('feedback')
                .insert({
                    name: name.trim() || null,
                    email: email.trim() || null,
                    type: type,
                    message: message.trim(),
                });

            if (error) throw error;

            // Succès !
            Alert.alert(
                '✅ Merci !',
                'Ton feedback a bien été envoyé. On le prend en compte ! 🙏',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ]
            );

            // Réinitialiser le formulaire
            setName('');
            setEmail('');
            setType('suggestion');
            setMessage('');

        } catch (error) {
            console.error('Erreur envoi feedback:', error);
            Alert.alert(
                '❌ Erreur',
                'Impossible d\'envoyer le feedback. Vérifie ta connexion internet.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                        >
                            <Text style={styles.backButtonText}>← Retour</Text>
                        </TouchableOpacity>

                        <Text style={styles.title}>💬 Ton avis compte !</Text>
                        <Text style={styles.subtitle}>
                            Aide-nous à améliorer Athlium en partageant ton feedback
                        </Text>
                    </View>

                    {/* Type de feedback */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Type de feedback</Text>
                        <View style={styles.typeContainer}>
                            {feedbackTypes.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.typeButton,
                                        type === item.id && styles.typeButtonActive
                                    ]}
                                    onPress={() => setType(item.id)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.typeLabel,
                                        type === item.id && styles.typeLabelActive
                                    ]}>
                                        {item.label}
                                    </Text>
                                    <Text style={[
                                        styles.typeDescription,
                                        type === item.id && styles.typeDescriptionActive
                                    ]}>
                                        {item.description}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Message (requis) */}
                    <View style={styles.section}>
                        <Text style={styles.label}>
                            Message <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Décris ton bug, suggestion ou commentaire..."
                            placeholderTextColor={COLORS.textSecondary}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            numberOfLines={6}
                            maxLength={1000}
                        />
                        <Text style={styles.charCount}>
                            {message.length} / 1000 caractères
                        </Text>
                    </View>

                    {/* Nom (optionnel) */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Nom (optionnel)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ton prénom ou pseudo"
                            placeholderTextColor={COLORS.textSecondary}
                            value={name}
                            onChangeText={setName}
                            maxLength={50}
                        />
                    </View>

                    {/* Email (optionnel) */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Email (optionnel)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="ton@email.com"
                            placeholderTextColor={COLORS.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            maxLength={100}
                        />
                        <Text style={styles.hint}>
                            Pour qu'on puisse te répondre 💬
                        </Text>
                    </View>

                    {/* Bouton Submit */}
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            loading && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.text} />
                        ) : (
                            <Text style={styles.submitButtonText}>
                                ✉️ Envoyer le feedback
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Note de confidentialité */}
                    <Text style={styles.privacy}>
                        🔒 Ton feedback est anonyme. On ne partage jamais tes données.
                    </Text>

                    {/* Espace en bas */}
                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 30,
    },
    backButton: {
        marginBottom: 20,
    },
    backButtonText: {
        fontSize: 16,
        color: COLORS.accent,
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    section: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
    },
    required: {
        color: COLORS.error,
    },
    typeContainer: {
        gap: 10,
    },
    typeButton: {
        backgroundColor: COLORS.backgroundCard,
        padding: 15,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.backgroundCard,
    },
    typeButtonActive: {
        borderColor: COLORS.accent,
        backgroundColor: COLORS.primaryDark,
    },
    typeLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    typeLabelActive: {
        color: COLORS.accent,
    },
    typeDescription: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    typeDescriptionActive: {
        color: COLORS.text,
    },
    input: {
        backgroundColor: COLORS.backgroundCard,
        borderWidth: 2,
        borderColor: COLORS.backgroundCard,
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: COLORS.text,
    },
    textArea: {
        backgroundColor: COLORS.backgroundCard,
        borderWidth: 2,
        borderColor: COLORS.backgroundCard,
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: COLORS.text,
        minHeight: 150,
        textAlignVertical: 'top',
    },
    charCount: {
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: 'right',
        marginTop: 5,
    },
    hint: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 5,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.accent,
        marginTop: 10,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    privacy: {
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },
});

export default FeedbackScreen;