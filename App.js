import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import ExerciseDetailScreen from './screens/ExerciseDetailScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import ExercisesListScreen from './screens/ExercisesListScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import SupportScreen from './screens/SupportScreen';
import { COLORS } from './constants/colors';

const Stack = createNativeStackNavigator();

export default function App() {
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
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}