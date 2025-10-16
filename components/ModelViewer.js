import React, { useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { loadAsync } from 'expo-three';
import { Asset } from 'expo-asset';

const ModelViewer = ({ onMuscleClick }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMuscle, setSelectedMuscle] = useState(null);

    // Liste des muscles cliquables (tous sauf "corps")
    const CLICKABLE_MUSCLES = [
        'abdominaux-obliques',
        'avant-bras',
        'biceps',
        'dos',
        'epaules',
        'fessiers-abducteur-adducteur',
        'ischios-jambiers',
        'mollets',
        'pectoraux',
        'quadriceps',
        'triceps'
    ];

    const onContextCreate = async (gl) => {
        try {
            // Configuration du renderer
            const renderer = new Renderer({ gl });
            renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
            renderer.setClearColor(0x1f1f1f, 1); // Fond gris foncé Athlium

            // Créer la scène
            const scene = new THREE.Scene();

            // Créer la caméra
            const camera = new THREE.PerspectiveCamera(
                50,
                gl.drawingBufferWidth / gl.drawingBufferHeight,
                0.1,
                1000
            );
            camera.position.set(0, 0, 8);
            camera.lookAt(0, 0, 0);

            // Lumières
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
            scene.add(ambientLight);

            const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight1.position.set(5, 5, 5);
            scene.add(directionalLight1);

            const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
            directionalLight2.position.set(-5, 3, -5);
            scene.add(directionalLight2);

            // Charger le modèle GLB
            console.log('Chargement du modèle 3D...');
            const asset = Asset.fromModule(require('../assets/body-model.glb'));
            await asset.downloadAsync();

            const model = await loadAsync(asset.localUri || asset.uri);

            // Ajuster le modèle
            model.scene.scale.set(0.15, 0.15, 0.15);
            model.scene.position.set(-0.93, -1.9, 0);

            scene.add(model.scene);

            // Parcourir tous les meshes et logger leurs noms
            console.log('=== Structure du modèle ===');
            const muscleMeshes = {};

            model.scene.traverse((child) => {
                if (child.isMesh) {
                    console.log('Mesh trouvé:', child.name);

                    // Stocker les muscles cliquables
                    if (CLICKABLE_MUSCLES.includes(child.name)) {
                        muscleMeshes[child.name] = child;

                        // Sauvegarder la couleur/matériau original
                        child.userData.originalMaterial = child.material.clone();
                    }

                    // Rendre "corps" semi-transparent (optionnel)
                    if (child.name === 'corps') {
                        child.material.transparent = true;
                        child.material.opacity = 1;
                    }
                }
            });

            console.log('Muscles cliquables trouvés:', Object.keys(muscleMeshes));

            setLoading(false);

            // Variables pour la rotation
            let isDragging = false;
            let previousTouch = { x: 0, y: 0 };
            let rotationY = 0;
            let rotationX = 0;
            const rotationSpeed = 0.005;

            // Boucle de rendu
            const render = () => {
                requestAnimationFrame(render);

                // Appliquer la rotation
                model.scene.rotation.y = rotationY;
                model.scene.rotation.x = rotationX;

                renderer.render(scene, camera);
                gl.endFrameEXP();
            };
            render();

            // Note: Les événements tactiles seront gérés dans la prochaine étape
            // Pour l'instant, rotation automatique désactivée pour voir le modèle

        } catch (err) {
            console.error('Erreur 3D:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#52fa7c" />
                    <Text style={styles.loadingText}>Chargement du modèle 3D...</Text>
                </View>
            )}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Erreur: {error}</Text>
                    <Text style={styles.errorDetails}>{error}</Text>
                </View>
            )}
            <GLView
                style={styles.glView}
                onContextCreate={onContextCreate}
            />
            {selectedMuscle && (
                <View style={styles.muscleInfo}>
                    <Text style={styles.muscleInfoText}>
                        Muscle: {selectedMuscle}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1f1f1f',
    },
    glView: {
        flex: 1,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1f1f1f',
        zIndex: 10,
    },
    loadingText: {
        color: '#52fa7c',
        marginTop: 10,
        fontSize: 16,
    },
    errorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1f1f1f',
        zIndex: 10,
        padding: 20,
    },
    errorText: {
        color: '#ff5252',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    errorDetails: {
        color: '#ff8a80',
        fontSize: 14,
        textAlign: 'center',
    },
    muscleInfo: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(82, 250, 124, 0.9)',
        padding: 15,
        borderRadius: 10,
    },
    muscleInfoText: {
        color: '#1f1f1f',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ModelViewer;