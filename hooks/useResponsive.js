// hooks/useResponsive.js
import { Dimensions, Platform } from 'react-native';

/**
 * Hook personnalisé pour gérer le responsive dans l'app
 * Adapte automatiquement les tailles selon l'appareil
 */
export const useResponsive = () => {
    const { width, height } = Dimensions.get('window');

    // Catégories d'appareils
    const isSmallDevice = width < 375;        // iPhone SE, petits Android
    const isMediumDevice = width >= 375 && width < 428;  // iPhone 12/13
    const isLargeDevice = width >= 428 && width < 768;   // iPhone Pro Max
    const isTablet = width >= 768;            // iPad, tablettes Android

    // Fonction de scaling adaptative
    const scale = (size) => {
        if (isSmallDevice) return Math.round(size * 0.85);  // 85% sur petits écrans
        if (isTablet) return Math.round(size * 1.15);       // 115% sur tablettes
        return size;  // 100% sur écrans standards
    };

    // Espacements adaptatifs
    const padding = {
        xs: isSmallDevice ? 8 : 12,
        sm: isSmallDevice ? 12 : 16,
        md: isSmallDevice ? 16 : 20,
        lg: isSmallDevice ? 20 : 24,
        xl: isSmallDevice ? 24 : 32,
    };

    // Tailles de police adaptatives
    const fontSize = {
        xs: isSmallDevice ? 10 : 12,
        sm: isSmallDevice ? 12 : 14,
        md: isSmallDevice ? 14 : 16,
        lg: isSmallDevice ? 16 : 18,
        xl: isSmallDevice ? 18 : 20,
        xxl: isSmallDevice ? 22 : isTablet ? 30 : 26,
        xxxl: isSmallDevice ? 32 : isTablet ? 56 : 48,
        title: isSmallDevice ? 20 : isTablet ? 32 : 28,
    };

    // Hauteurs adaptatives
    const heights = {
        header: Platform.OS === 'ios'
            ? (isSmallDevice ? 70 : 110)
            : (isSmallDevice ? 60 : 80),
        button: isSmallDevice ? 40 : 50,
        input: isSmallDevice ? 45 : 55,
    };

    // Largeurs maximales
    const maxWidths = {
        menu: Math.min(width * 0.8, 400),  // Menu max 400px
        content: isTablet ? 600 : width,   // Contenu max 600px sur tablette
        modal: isTablet ? 500 : width * 0.9,  // Modal max 500px sur tablette
    };

    return {
        // Dimensions brutes
        width,
        height,

        // Catégories
        isSmallDevice,
        isMediumDevice,
        isLargeDevice,
        isTablet,

        // Fonctions
        scale,

        // Valeurs adaptatives
        padding,
        fontSize,
        heights,
        maxWidths,

        // Helpers
        isPortrait: height > width,
        isLandscape: width > height,
        aspectRatio: width / height,
    };
};

export default useResponsive;