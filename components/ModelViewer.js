import React, { useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, PanResponder } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { loadAsync } from 'expo-three';
import { Asset } from 'expo-asset';

// ===== VARIABLES GLOBALES =====
let scene, camera, renderer, modelRef;
let rotationY = 0;
let rotationX = 0;
let targetRotationY = 0;
let targetRotationX = 0;
// ===== FIN VARIABLES =====

const ModelViewer = ({ onMuscleClick }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMuscle, setSelectedMuscle] = useState(null);

    // ===== PAN RESPONDER POUR LA ROTATION =====
    const lastPosition = useRef({ x: 0, y: 0 });

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt, gestureState) => {
                lastPosition.current = {
                    x: gestureState.x0,
                    y: gestureState.y0
                };
            },
            onPanResponderMove: (evt, gestureState) => {
                const deltaX = gestureState.moveX - lastPosition.current.x;
                const deltaY = gestureState.moveY - lastPosition.current.y;

                // Rotation du modèle (pas de la caméra)
                targetRotationY += deltaX * 0.01;
                targetRotationX -= deltaY * 0.01;

                // Limiter la rotation verticale
                targetRotationX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetRotationX));

                lastPosition.current = {
                    x: gestureState.moveX,
                    y: gestureState.moveY
                };
            },
            onPanResponderRelease: () => {
                lastPosition.current = { x: 0, y: 0 };
            },
        })
    ).current;
    // ===== FIN PAN RESPONDER =====

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
            renderer = new Renderer({ gl });
            renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
            renderer.setClearColor(0x1f1f1f, 1);

            // Créer la scène
            scene = new THREE.Scene();

            // Créer la caméra (FIXE)
            camera = new THREE.PerspectiveCamera(
                75,
                gl.drawingBufferWidth / gl.drawingBufferHeight,
                0.1,
                1000
            );
            // La caméra reste FIXE à cette position
            camera.position.set(0, 0, 4);
            camera.lookAt(0, 0, 0);

            // Lumières
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);

            const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
            directionalLight2.position.set(-5, 3, -5);
            scene.add(directionalLight2);

            // Charger le modèle GLB
            console.log('Chargement du modèle 3D...');
            const asset = Asset.fromModule(require('../assets/body-model.glb'));
            await asset.downloadAsync();

            const model = await loadAsync(asset.localUri || asset.uri);

            // ===== CENTRAGE AUTOMATIQUE PARFAIT =====

            const box = new THREE.Box3().setFromObject(model.scene);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            console.log('=== Informations du modèle ===');
            console.log('Centre original:', center);
            console.log('Taille:', size);

            // Calculer l'échelle pour que le modèle occupe ~70% de l'écran
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3 / maxDim;
            model.scene.scale.setScalar(scale);

            // ⭐ CENTRER LE MODÈLE PARFAITEMENT SUR X, Y et Z
            // Le modèle doit être à (0, 0, 0) pour être au centre de l'écran
            model.scene.position.set(
                -center.x * scale,  // Centre sur X
                -center.y * scale,  // Centre sur Y
                -center.z * scale   // Centre sur Z
            );

            console.log('Échelle appliquée:', scale);
            console.log('Position finale du modèle:', model.scene.position);

            // ===== FIN CENTRAGE AUTOMATIQUE =====

            // ⭐ CRÉER UN GROUPE POUR LA ROTATION
            // Le groupe sera au centre (0,0,0) et le modèle sera décalé dedans
            const modelGroup = new THREE.Group();
            modelGroup.position.set(0, 0, 0); // Le groupe est au centre

            // Ajouter le modèle dans le groupe (avec son offset de centrage)
            modelGroup.add(model.scene);

            // Ajouter le GROUPE à la scène (pas le modèle directement)
            scene.add(modelGroup);

            // Sauvegarder la référence du GROUPE (pas du modèle)
            modelRef = modelGroup;

            console.log('✅ Groupe créé - Le modèle tournera autour de son centre');

            // Parcourir tous les meshes
            console.log('=== Structure du modèle ===');
            const muscleMeshes = {};

            model.scene.traverse((child) => {
                if (child.isMesh) {
                    console.log('Mesh trouvé:', child.name);

                    if (CLICKABLE_MUSCLES.includes(child.name)) {
                        muscleMeshes[child.name] = child;
                        child.userData.originalMaterial = child.material.clone();
                    }

                    if (child.name === 'corps') {
                        child.material.transparent = false;
                        child.material.opacity = 1;
                    }
                }
            });

            console.log('Muscles cliquables trouvés:', Object.keys(muscleMeshes));

            setLoading(false);

            // Boucle de rendu avec rotation UNIQUEMENT DU MODÈLE
            const render = () => {
                requestAnimationFrame(render);

                // Interpolation pour une rotation fluide
                rotationY += (targetRotationY - rotationY) * 0.1;
                rotationX += (targetRotationX - rotationX) * 0.1;

                // ⭐ ROTATION DU MODÈLE (pas de la caméra)
                if (modelRef) {
                    modelRef.rotation.y = rotationY;
                    modelRef.rotation.x = rotationX;
                }

                // La caméra reste FIXE
                renderer.render(scene, camera);
                gl.endFrameEXP();
            };
            render();

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
                {...panResponder.panHandlers}
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