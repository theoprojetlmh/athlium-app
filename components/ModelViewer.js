import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, PixelRatio, TouchableOpacity, PanResponder, Alert } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { loadAsync } from 'expo-three';
import { Asset } from 'expo-asset';
import { COLORS } from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

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
    'triceps',
];

const ModelViewer = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMuscle, setSelectedMuscle] = useState(null);

    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const modelRef = useRef(null);
    const modelGroupRef = useRef(null);
    const raycasterRef = useRef(null);
    const muscleMeshesRef = useRef({});
    const selectedMeshRef = useRef(null);
    const animationFrameRef = useRef(null);

    const rotationRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
    const cameraZRef = useRef({ current: 4, target: 4 });
    const panRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

    const glViewRef = useRef(null);
    const glDimensionsRef = useRef({ width: 0, height: 0 });

    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            if (sceneRef.current) {
                sceneRef.current.traverse((object) => {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(mat => mat.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                });
            }

            if (rendererRef.current) {
                rendererRef.current.dispose();
            }

            console.log('🧹 ModelViewer cleaned up');
        };
    }, []);

    const performRaycast = (screenX, screenY) => {
        if (!raycasterRef.current || !cameraRef.current || !sceneRef.current) return;

        const { width, height } = glDimensionsRef.current;
        if (width === 0 || height === 0) return;

        const ratio = PixelRatio.get();
        const xPx = screenX * ratio;
        const yPx = screenY * ratio;

        if (modelGroupRef.current) modelGroupRef.current.updateMatrixWorld(true);
        sceneRef.current.updateMatrixWorld(true);

        const mouse = new THREE.Vector2();
        mouse.x = (xPx / width) * 2 - 1;
        mouse.y = -(yPx / height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouse, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects([modelGroupRef.current], true);

        if (intersects.length > 0) {
            for (let intersect of intersects) {
                const mesh = intersect.object;
                if (CLICKABLE_MUSCLES.includes(mesh.name)) {
                    handleMuscleClick(mesh);
                    return;
                }
            }
        } else if (selectedMeshRef.current) {
            resetMuscleHighlight();
            setSelectedMuscle(null);
        }
    };

    const handleMuscleClick = (mesh) => {
        resetMuscleHighlight();

        if (!mesh.userData.highlightMaterial) {
            mesh.userData.highlightMaterial = mesh.material.clone();
        }

        mesh.material = mesh.userData.highlightMaterial;
        mesh.material.emissive = new THREE.Color(0x50FA7B);
        mesh.material.emissiveIntensity = 0.5;

        selectedMeshRef.current = mesh;
        setSelectedMuscle(mesh.name);
    };

    const resetMuscleHighlight = () => {
        if (selectedMeshRef.current && selectedMeshRef.current.userData.originalMaterial) {
            selectedMeshRef.current.material = selectedMeshRef.current.userData.originalMaterial;
            selectedMeshRef.current = null;
        }
    };

    const navigateToExercises = (muscleSlug) => {
        console.log('🔍 Navigation vers exercices pour:', muscleSlug);
        navigation.navigate('ExercisesList', {
            muscle: muscleSlug,
            muscleName: selectedMuscle
        });
    };

    const savedRotation = useRef({ x: 0, y: 0 });
    const savedPan = useRef({ x: 0, y: 0 });
    const savedScale = useRef(1);
    const initialDistance = useRef(0);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: (evt, gestureState) => {
                const touches = evt.nativeEvent.touches;

                if (touches.length === 1) {
                    savedRotation.current = {
                        x: rotationRef.current.targetX,
                        y: rotationRef.current.targetY
                    };
                } else if (touches.length === 2) {
                    savedScale.current = cameraZRef.current.target;
                    savedPan.current = {
                        x: panRef.current.targetX,
                        y: panRef.current.targetY
                    };

                    const dx = touches[0].pageX - touches[1].pageX;
                    const dy = touches[0].pageY - touches[1].pageY;
                    initialDistance.current = Math.sqrt(dx * dx + dy * dy);
                }
            },

            onPanResponderMove: (evt, gestureState) => {
                const touches = evt.nativeEvent.touches;

                if (touches.length === 1) {
                    rotationRef.current.targetY = savedRotation.current.y + gestureState.dx * 0.01;
                    rotationRef.current.targetX = savedRotation.current.x - gestureState.dy * 0.01;
                    rotationRef.current.targetX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, rotationRef.current.targetX));
                } else if (touches.length === 2) {
                    const dx = touches[0].pageX - touches[1].pageX;
                    const dy = touches[0].pageY - touches[1].pageY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    const scale = initialDistance.current / distance;
                    const newZ = savedScale.current * scale;
                    cameraZRef.current.target = Math.max(2, Math.min(8, newZ));

                    panRef.current.targetX = savedPan.current.x + gestureState.dx * 0.003;
                    panRef.current.targetY = savedPan.current.y - gestureState.dy * 0.003;
                    panRef.current.targetX = Math.max(-2, Math.min(2, panRef.current.targetX));
                    panRef.current.targetY = Math.max(-2, Math.min(2, panRef.current.targetY));
                }
            },

            onPanResponderRelease: (evt, gestureState) => {
                const touches = evt.nativeEvent.changedTouches;

                if (touches.length === 1 && Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10) {
                    if (glViewRef.current) {
                        glViewRef.current.measure((x, y, width, height, pageX, pageY) => {
                            const touchX = touches[0].pageX;
                            const touchY = touches[0].pageY;

                            const relativeX = touchX - pageX;
                            const relativeY = touchY - pageY;

                            performRaycast(relativeX, relativeY);
                        });
                    }
                }
            },
        })
    ).current;

    const onContextCreate = async (gl) => {
        try {
            glDimensionsRef.current = {
                width: gl.drawingBufferWidth,
                height: gl.drawingBufferHeight
            };

            rendererRef.current = new Renderer({ gl });
            rendererRef.current.setSize(glDimensionsRef.current.width, glDimensionsRef.current.height);
            rendererRef.current.setClearColor(0x1E1E1E, 1);

            sceneRef.current = new THREE.Scene();

            cameraRef.current = new THREE.PerspectiveCamera(
                75,
                glDimensionsRef.current.width / glDimensionsRef.current.height,
                0.1,
                1000
            );
            cameraRef.current.position.z = cameraZRef.current.current;
            cameraRef.current.lookAt(0, 0, 0);

            raycasterRef.current = new THREE.Raycaster();

            sceneRef.current.add(new THREE.AmbientLight(0xffffff, 0.6));
            const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
            dirLight.position.set(5, 10, 5);
            sceneRef.current.add(dirLight);

            // PROTECTION : Vérifier que le fichier existe
            let asset;
            try {
                asset = Asset.fromModule(require('../assets/body-model.glb'));
                if (!asset) {
                    throw new Error('Fichier body-model.glb introuvable');
                }
                await asset.downloadAsync();
            } catch (assetError) {
                console.error('❌ Erreur chargement asset:', assetError);
                throw new Error('Le fichier du modèle 3D est manquant. Ajoute body-model.glb dans le dossier assets/');
            }

            // PROTECTION : Vérifier que l'URI est valide
            const uri = asset.uri || asset.localUri;
            if (!uri || uri === 'undefined' || uri.trim() === '') {
                throw new Error('URI du modèle 3D invalide');
            }

            console.log('✅ Chargement du modèle depuis:', uri);

            const loadedModel = await loadAsync(uri);

            modelGroupRef.current = new THREE.Group();
            sceneRef.current.add(modelGroupRef.current);

            modelRef.current = loadedModel.scene || loadedModel;
            modelGroupRef.current.add(modelRef.current);
            modelRef.current.updateMatrixWorld(true);

            const box = new THREE.Box3().setFromObject(modelRef.current);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1;

            const scale = 3 / maxDim;
            modelRef.current.scale.setScalar(scale);
            modelRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

            modelRef.current.updateMatrixWorld(true);
            modelGroupRef.current.position.set(0, 0, 0);

            rotationRef.current = { x: 0, y: 0, targetX: 0, targetY: 0 };
            modelGroupRef.current.rotation.y = 0;

            muscleMeshesRef.current = {};
            modelRef.current.traverse((child) => {
                if (child.isMesh) {
                    child.raycast = THREE.Mesh.prototype.raycast;
                    if (CLICKABLE_MUSCLES.includes(child.name)) {
                        muscleMeshesRef.current[child.name] = child;
                        child.userData.originalMaterial = child.material.clone();
                    }
                }
            });

            setLoading(false);

            const render = () => {
                animationFrameRef.current = requestAnimationFrame(render);

                rotationRef.current.y += (rotationRef.current.targetY - rotationRef.current.y) * 0.1;
                rotationRef.current.x += (rotationRef.current.targetX - rotationRef.current.x) * 0.1;
                cameraZRef.current.current += (cameraZRef.current.target - cameraZRef.current.current) * 0.1;
                panRef.current.x += (panRef.current.targetX - panRef.current.x) * 0.1;
                panRef.current.y += (panRef.current.targetY - panRef.current.y) * 0.1;

                if (modelGroupRef.current) {
                    modelGroupRef.current.rotation.y = rotationRef.current.y;
                    modelGroupRef.current.rotation.x = rotationRef.current.x;
                    modelGroupRef.current.position.x = panRef.current.x;
                    modelGroupRef.current.position.y = panRef.current.y;
                }

                if (cameraRef.current) {
                    cameraRef.current.position.z = cameraZRef.current.current;
                }

                rendererRef.current.render(sceneRef.current, cameraRef.current);
                gl.endFrameEXP();
            };
            render();
        } catch (err) {
            console.error('❌ Erreur 3D:', err);
            setError(err.message || 'Erreur de chargement du modèle 3D');
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {loading && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color={COLORS.accent} />
                    <Text style={styles.loadingText}>Chargement du modèle 3D...</Text>
                </View>
            )}
            {error && (
                <View style={styles.overlay}>
                    <Text style={styles.errorIcon}>⚠️</Text>
                    <Text style={styles.errorText}>Erreur de chargement</Text>
                    <Text style={styles.errorDetails}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                            setError(null);
                            setLoading(true);
                            // Recharger
                            setTimeout(() => {
                                navigation.replace('Home');
                            }, 100);
                        }}
                    >
                        <Text style={styles.retryButtonText}>🔄 Réessayer</Text>
                    </TouchableOpacity>
                </View>
            )}

            {!error && (
                <View
                    ref={glViewRef}
                    style={styles.glView}
                    {...panResponder.panHandlers}
                >
                    <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
                </View>
            )}

            {selectedMuscle && !error && (
                <View style={styles.muscleInfoOuterGlow}>
                    <View style={styles.muscleInfoInnerGlow}>
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.primaryDark]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.muscleInfo}
                        >
                            <Text style={styles.muscleInfoText}>
                                💪 {selectedMuscle.replace(/-/g, ' ').toUpperCase()}
                            </Text>
                            <TouchableOpacity
                                style={styles.viewExercisesButton}
                                onPress={() => navigateToExercises(selectedMuscle)}
                            >
                                <Text style={styles.viewExercisesButtonText}>
                                    Voir les exercices →
                                </Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    glView: {
        flex: 1
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        zIndex: 10,
        padding: 20,
    },
    loadingText: {
        color: COLORS.accent,
        marginTop: 10,
        fontSize: 16
    },
    errorIcon: {
        fontSize: 60,
        marginBottom: 20,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    errorDetails: {
        color: COLORS.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLORS.accent,
    },
    retryButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    muscleInfoOuterGlow: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        borderRadius: 18,
        backgroundColor: 'transparent',
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.95,
        shadowRadius: 30,
        elevation: 25,
    },
    muscleInfoInnerGlow: {
        borderRadius: 16,
        backgroundColor: 'transparent',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 20,
    },
    muscleInfo: {
        padding: 18,
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(80, 250, 123, 0.3)',
    },
    muscleInfoText: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
        textShadowColor: COLORS.accent,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    viewExercisesButton: {
        backgroundColor: COLORS.secondary,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginTop: 12,
        alignItems: 'center',
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 8,
    },
    viewExercisesButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
});

export default ModelViewer;