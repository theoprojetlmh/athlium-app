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
import { useResponsive } from '../hooks/useResponsive';

const FeedbackScreen = ({ navigation }) => {
    const { fontSize, padding } = useResponsive();
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
                    contentContainerStyle={[styles.scrollContent, { padding: padding.md }]}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={[styles.header, { marginBottom: padding.lg }]}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                        >
                            <Text style={[styles.backButtonText, { fontSize: fontSize.md }]}>← Retour</Text>
                        </TouchableOpacity>

                        <Text style={[styles.title, { fontSize: fontSize.xxxl, marginBottom: padding.xs }]}>💬 Ton avis compte !</Text>
                        <Text style={[styles.subtitle, { fontSize: fontSize.md }]}>
                            Aide-nous à améliorer Athlium en partageant ton feedback
                        </Text>
                    </View>

                    {/* Type de feedback */}
                    <View style={[styles.section, { marginBottom: padding.lg }]}>
                        <Text style={[styles.label, { fontSize: fontSize.md, marginBottom: padding.xs }]}>Type de feedback</Text>
                        <View style={styles.typeContainer}>
                            {feedbackTypes.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.typeButton,
                                        { padding: padding.sm },
                                        type === item.id && styles.typeButtonActive
                                    ]}
                                    onPress={() => setType(item.id)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.typeLabel,
                                        { fontSize: fontSize.md, marginBottom: 4 },
                                        type === item.id && styles.typeLabelActive
                                    ]}>
                                        {item.label}
                                    </Text>
                                    <Text style={[
                                        styles.typeDescription,
                                        { fontSize: fontSize.sm },
                                        type === item.id && styles.typeDescriptionActive
                                    ]}>
                                        {item.description}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Message (requis) */}
                    <View style={[styles.section, { marginBottom: padding.lg }]}>
                        <Text style={[styles.label, { fontSize: fontSize.md, marginBottom: padding.xs }]}>
                            Message <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={[styles.textArea, { padding: padding.sm, fontSize: fontSize.md }]}
                            placeholder="Décris ton bug, suggestion ou commentaire..."
                            placeholderTextColor={COLORS.textSecondary}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            numberOfLines={6}
                            maxLength={1000}
                        />
                        <Text style={[styles.charCount, { fontSize: fontSize.xs }]}>
                            {message.length} / 1000 caractères
                        </Text>
                    </View>

                    {/* Nom (optionnel) */}
                    <View style={[styles.section, { marginBottom: padding.lg }]}>
                        <Text style={[styles.label, { fontSize: fontSize.md, marginBottom: padding.xs }]}>Nom (optionnel)</Text>
                        <TextInput
                            style={[styles.input, { padding: padding.sm, fontSize: fontSize.md }]}
                            placeholder="Ton prénom ou pseudo"
                            placeholderTextColor={COLORS.textSecondary}
                            value={name}
                            onChangeText={setName}
                            maxLength={50}
                        />
                    </View>

                    {/* Email (optionnel) */}
                    <View style={[styles.section, { marginBottom: padding.lg }]}>
                        <Text style={[styles.label, { fontSize: fontSize.md, marginBottom: padding.xs }]}>Email (optionnel)</Text>
                        <TextInput
                            style={[styles.input, { padding: padding.sm, fontSize: fontSize.md }]}
                            placeholder="ton@email.com"
                            placeholderTextColor={COLORS.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            maxLength={100}
                        />
                        <Text style={[styles.hint, { fontSize: fontSize.xs }]}>
                            Pour qu'on puisse te répondre 💬
                        </Text>
                    </View>

                    {/* Bouton Submit */}
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            { padding: padding.lg },
                            loading && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.text} />
                        ) : (
                            <Text style={[styles.submitButtonText, { fontSize: fontSize.lg }]}>
                                ✉️ Envoyer le feedback
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Note de confidentialité */}
                    <Text style={[styles.privacy, { fontSize: fontSize.xs, marginTop: padding.md }]}>
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
        // padding géré dynamiquement
    },
    header: {
        // marginBottom géré dynamiquement
    },
    backButton: {
        marginBottom: 20,
    },
    backButtonText: {
        color: COLORS.accent,
        fontWeight: '600',
    },
    title: {
        fontWeight: 'bold',
        color: COLORS.text,
        // marginBottom géré dynamiquement
    },
    subtitle: {
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    section: {
        // marginBottom géré dynamiquement
    },
    label: {
        fontWeight: 'bold',
        color: COLORS.text,
        // marginBottom géré dynamiquement
    },
    required: {
        color: COLORS.error,
    },
    typeContainer: {
        gap: 10,
    },
    typeButton: {
        backgroundColor: COLORS.backgroundCard,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.backgroundCard,
    },
    typeButtonActive: {
        borderColor: COLORS.accent,
        backgroundColor: COLORS.primaryDark,
    },
    typeLabel: {
        fontWeight: 'bold',
        color: COLORS.text,
    },
    typeLabelActive: {
        color: COLORS.accent,
    },
    typeDescription: {
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
        color: COLORS.text,
    },
    textArea: {
        backgroundColor: COLORS.backgroundCard,
        borderWidth: 2,
        borderColor: COLORS.backgroundCard,
        borderRadius: 12,
        color: COLORS.text,
        minHeight: 150,
        textAlignVertical: 'top',
    },
    charCount: {
        color: COLORS.textSecondary,
        textAlign: 'right',
        marginTop: 5,
    },
    hint: {
        color: COLORS.textSecondary,
        marginTop: 5,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.accent,
        marginTop: 10,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontWeight: 'bold',
        color: COLORS.text,
    },
    privacy: {
        color: COLORS.textSecondary,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default FeedbackScreen;