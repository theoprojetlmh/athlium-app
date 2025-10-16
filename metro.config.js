const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ajouter les extensions de fichiers 3D
config.resolver.assetExts.push(
    'glb',
    'gltf',
    'obj',
    'mtl',
    'fbx'
);

module.exports = config;