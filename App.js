import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  const [muscles, setMuscles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les muscles
  const fetchMuscles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('muscles')
        .select('*')
        .order('name');

      if (error) throw error;

      setMuscles(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les muscles au démarrage
  useEffect(() => {
    fetchMuscles();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Athlium 💪</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#52fa7c" />
      ) : error ? (
        <Text style={styles.error}>Erreur: {error}</Text>
      ) : (
        <View>
          <Text style={styles.subtitle}>
            {muscles.length} muscles chargés depuis Supabase ✅
          </Text>
          {muscles.map((muscle) => (
            <Text key={muscle.id} style={styles.muscleName}>
              • {muscle.name}
            </Text>
          ))}
        </View>
      )}

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#52fa7c',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    color: '#ccd4ff',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  muscleName: {
    color: '#52fa7c',
    fontSize: 16,
    marginVertical: 3,
  },
  error: {
    color: '#ff5252',
    fontSize: 16,
  },
});