import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, ActivityIndicator, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationBar from 'expo-navigation-bar';

// Screens
import HomeScreen from './screens/HomeScreen';
import ExerciseDetailScreen from './screens/ExerciseDetailScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import ExercisesListScreen from './screens/ExercisesListScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import SupportScreen from './screens/SupportScreen';
import ChangelogScreen from './screens/ChangelogScreen'; // NOUVEAU
import WelcomeScreen from './screens/WelcomeScreen';     // NOUVEAU

import { COLORS } from './constants/colors';

const Stack = createNativeStackNavigator();
const FIRST_LAUNCH_KEY = '@athlium_first_launch';

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkFirstLaunch();

    // Configurer la barre de navigation transparente sur Android
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#00000000');
      NavigationBar.setButtonStyleAsync('light');
      NavigationBar.setVisibilityAsync('visible');
    }
  }, []);

  const checkFirstLaunch = async () => {
    try {
      console.log('🔍 Vérification premier lancement...');
      const hasLaunched = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);

      if (hasLaunched === null) {
        console.log('✨ Premier lancement détecté');
        setIsFirstLaunch(true);
      } else {
        console.log('🔄 Lancement suivant');
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.error('❌ Erreur vérification premier lancement:', error);
      setIsFirstLaunch(false);
    } finally {
      setLoading(false);
    }
  };

  const handleWelcomeComplete = async () => {
    try {
      console.log('💾 Sauvegarde du premier lancement...');
      await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'completed');
      console.log('✅ Premier lancement sauvegardé');

      setTimeout(() => {
        setIsFirstLaunch(false);
      }, 300);
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      setIsFirstLaunch(false);
    }
  };

  // Loading initial
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Chargement...</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  // Premier lancement : afficher Welcome Screen
  if (isFirstLaunch) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <WelcomeScreen onComplete={handleWelcomeComplete} />
          <StatusBar style="light" />
        </View>
      </SafeAreaProvider>
    );
  }

  // Lancements suivants : afficher l'app normale avec navigation
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.background,
            },
            headerTintColor: COLORS.accent,
            headerTitleStyle: {
              fontWeight: 'bold',
              color: COLORS.text,
            },
            contentStyle: {
              backgroundColor: COLORS.background,
            },
          }}
        >
          {/* Modèle 3D (accueil) */}
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false,
              title: 'ATHLIUM'
            }}
          />

          {/* Écrans de feedback et support */}
          <Stack.Screen
            name="Feedback"
            component={FeedbackScreen}
            options={{
              title: 'Feedback',
              headerShown: false
            }}
          />

          <Stack.Screen
            name="Support"
            component={SupportScreen}
            options={{
              title: 'Soutenir ATHLIUM',
              headerBackTitle: 'Retour'
            }}
          />

          {/* Écran des catégories */}
          <Stack.Screen
            name="Categories"
            component={CategoriesScreen}
            options={{
              title: 'Catégories',
              headerShown: false
            }}
          />

          {/* Liste des exercices par catégorie ou muscle */}
          <Stack.Screen
            name="ExercisesList"
            component={ExercisesListScreen}
            options={{
              headerShown: false
            }}
          />

          {/* Détail d'un exercice */}
          <Stack.Screen
            name="ExerciseDetail"
            component={ExerciseDetailScreen}
            options={{
              title: "Détails de l'exercice",
              headerBackTitle: 'Retour'
            }}
          />

          {/* NOUVEAUX ÉCRANS */}
          <Stack.Screen
            name="Changelog"
            component={ChangelogScreen}
            options={{
              title: 'Notes de version',
              headerShown: false
            }}
          />

          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{
              title: 'Vision du projet',
              headerShown: false
            }}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.accent,
    marginTop: 12,
    fontSize: 16,
  },
});