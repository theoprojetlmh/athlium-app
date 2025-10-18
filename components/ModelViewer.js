import React, { useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, PixelRatio } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { loadAsync } from 'expo-three';
import { Asset } from 'expo-asset';

// === VARIABLES GLOBALES ===
let scene, camera, renderer, modelRef, modelGroup;
let rotationY = 0, rotationX = 0;
let targetRotationY = 0, targetRotationX = 0;
let cameraZ = 4, targetCameraZ = 4;
let panX = 0, panY = 0, targetPanX = 0, targetPanY = 0;

let raycaster = null;
let glWidth = 0, glHeight = 0;
let muscleMeshes = {}, selectedMesh = null;
let setSelectedMuscleCallback = null;

// === MUSCLES CIBLABLES ===
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

// === RAYCAST ===
const performRaycast = (screenX, screenY) => {
    if (!raycaster || !camera || !scene || glWidth === 0 || glHeight === 0) return;

    const ratio = PixelRatio.get();
    const xPx = screenX * ratio;
    const yPx = screenY * ratio;

    if (modelGroup) modelGroup.updateMatrixWorld(true);
    scene.updateMatrixWorld(true);

    const mouse = new THREE.Vector2();
    mouse.x = (xPx / glWidth) * 2 - 1;
    mouse.y = -(yPx / glHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([modelGroup], true);

    if (intersects.length > 0) {
        for (let intersect of intersects) {
            const mesh = intersect.object;
            if (CLICKABLE_MUSCLES.includes(mesh.name)) {
                handleMuscleClick(mesh);
                return;
            }
        }
    } else if (selectedMesh) {
        resetMuscleHighlight();
        if (setSelectedMuscleCallback) setSelectedMuscleCallback(null);
    }
};

const handleMuscleClick = (mesh) => {
    resetMuscleHighlight();

    if (!mesh.userData.highlightMaterial) {
        mesh.userData.highlightMaterial = mesh.material.clone();
    }

    mesh.material = mesh.userData.highlightMaterial;
    mesh.material.emissive = new THREE.Color(0x52fa7c);
    mesh.material.emissiveIntensity = 0.5;

    selectedMesh = mesh;
    if (setSelectedMuscleCallback) setSelectedMuscleCallback(mesh.name);
};

const resetMuscleHighlight = () => {
    if (selectedMesh && selectedMesh.userData.originalMaterial) {
        selectedMesh.material = selectedMesh.userData.originalMaterial;
        selectedMesh = null;
    }
};

// === COMPOSANT PRINCIPAL ===
const ModelViewer = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMuscle, setSelectedMuscle] = useState(null);

    setSelectedMuscleCallback = setSelectedMuscle;

    const savedRotation = useRef({ x: 0, y: 0 });
    const savedPan = useRef({ x: 0, y: 0 });
    const savedScale = useRef(1);

    // === GESTURES ===
    const tapGesture = Gesture.Tap()
        .maxDuration(250)
        .numberOfTaps(1)
        .onEnd((e) => performRaycast(e.x, e.y));

    const panGesture = Gesture.Pan()
        .onStart(() => (savedRotation.current = { x: targetRotationX, y: targetRotationY }))
        .onUpdate((e) => {
            targetRotationY = savedRotation.current.y + e.translationX * 0.01;
            targetRotationX = savedRotation.current.x - e.translationY * 0.01;
            targetRotationX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetRotationX));
        });

    const pinchGesture = Gesture.Pinch()
        .onStart(() => (savedScale.current = targetCameraZ))
        .onUpdate((e) => {
            const newZ = savedScale.current / e.scale;
            targetCameraZ = Math.max(2, Math.min(8, newZ));
        });

    const twoFingerPan = Gesture.Pan()
        .minPointers(2)
        .maxPointers(2)
        .onStart(() => (savedPan.current = { x: targetPanX, y: targetPanY }))
        .onUpdate((e) => {
            targetPanX = savedPan.current.x + e.translationX * 0.003;
            targetPanY = savedPan.current.y - e.translationY * 0.003;
            targetPanX = Math.max(-2, Math.min(2, targetPanX));
            targetPanY = Math.max(-2, Math.min(2, targetPanY));
        });

    const composed = Gesture.Race(tapGesture, Gesture.Simultaneous(pinchGesture, twoFingerPan), panGesture);

    // === INITIALISATION 3D ===
    const onContextCreate = async (gl) => {
        try {
            glWidth = gl.drawingBufferWidth;
            glHeight = gl.drawingBufferHeight;

            renderer = new Renderer({ gl });
            renderer.setSize(glWidth, glHeight);
            renderer.setClearColor(0x1f1f1f, 1);

            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(75, glWidth / glHeight, 0.1, 1000);
            camera.position.z = cameraZ;
            camera.lookAt(0, 0, 0);

            raycaster = new THREE.Raycaster();

            scene.add(new THREE.AmbientLight(0xffffff, 0.6));
            const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
            dirLight.position.set(5, 10, 5);
            scene.add(dirLight);

            const asset = Asset.fromModule(require('../assets/body-model.glb'));
            await asset.downloadAsync();

            const loadedModel = await loadAsync(asset.uri || asset.localUri);

            // Centrage & mise à l’échelle
            modelGroup = new THREE.Group();
            scene.add(modelGroup);

            modelRef = loadedModel.scene || loadedModel;
            modelGroup.add(modelRef);
            modelRef.updateMatrixWorld(true);

            const box = new THREE.Box3().setFromObject(modelRef);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1;

            const scale = 3 / maxDim;
            modelRef.scale.setScalar(scale);
            modelRef.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

            modelRef.updateMatrixWorld(true);
            modelGroup.position.set(0, 0, 0);

            targetRotationY = rotationY = Math.PI;
            modelGroup.rotation.y = Math.PI;

            // Activation des muscles cliquables
            muscleMeshes = {};
            modelRef.traverse((child) => {
                if (child.isMesh) {
                    child.raycast = THREE.Mesh.prototype.raycast;
                    if (CLICKABLE_MUSCLES.includes(child.name)) {
                        muscleMeshes[child.name] = child;
                        child.userData.originalMaterial = child.material.clone();
                    }
                }
            });

            setLoading(false);

            // === RENDER LOOP ===
            const render = () => {
                requestAnimationFrame(render);

                rotationY += (targetRotationY - rotationY) * 0.1;
                rotationX += (targetRotationX - rotationX) * 0.1;
                cameraZ += (targetCameraZ - cameraZ) * 0.1;
                panX += (targetPanX - panX) * 0.1;
                panY += (targetPanY - panY) * 0.1;

                if (modelGroup) {
                    modelGroup.rotation.y = rotationY;
                    modelGroup.rotation.x = rotationX;
                    modelGroup.position.x = panX;
                    modelGroup.position.y = panY;
                }

                if (camera) camera.position.z = cameraZ;

                renderer.render(scene, camera);
                gl.endFrameEXP();
            };
            render();
        } catch (err) {
            console.error('Erreur 3D:', err);
            setError(`Erreur de chargement: ${err.message}\nVérifiez le chemin du fichier body-model.glb`);
            setLoading(false);
        }
    };

    // === RENDER REACT ===
    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.container}>
                {loading && (
                    <View style={styles.overlay}>
                        <ActivityIndicator size="large" color="#52fa7c" />
                        <Text style={styles.loadingText}>Chargement du modèle 3D...</Text>
                    </View>
                )}
                {error && (
                    <View style={styles.overlay}>
                        <Text style={styles.errorText}>Erreur de chargement</Text>
                        <Text style={styles.errorDetails}>{error}</Text>
                    </View>
                )}

                <GestureDetector gesture={composed}>
                    <GLView style={styles.glView} onContextCreate={onContextCreate} />
                </GestureDetector>

                {selectedMuscle && (
                    <View style={styles.muscleInfo}>
                        <Text style={styles.muscleInfoText}>
                            💪 {selectedMuscle.replace(/-/g, ' ').toUpperCase()}
                        </Text>
                    </View>
                )}
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1f1f1f' },
    glView: { flex: 1 },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1f1f1f',
        zIndex: 10,
    },
    loadingText: { color: '#52fa7c', marginTop: 10, fontSize: 16 },
    errorText: { color: '#ff5252', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    errorDetails: { color: '#ff8a80', fontSize: 14, textAlign: 'center', paddingHorizontal: 16 },
    muscleInfo: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(82, 250, 124, 0.95)',
        padding: 18,
        borderRadius: 15,
        shadowColor: '#52fa7c',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    muscleInfoText: {
        color: '#1f1f1f',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
    },
});

export default ModelViewer;
