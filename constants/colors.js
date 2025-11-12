// constants/colors.js
// ⚡ PALETTE "ELECTRIC PURPLE" - Moderne & Premium
// Inspiré de : Peloton, Apple Fitness+, Spotify

export const colors = {
    // Couleurs de fond
    background: '#0E0E14',       // Noir pur
    backgroundCard: '#1A1A24',   // Gris violet foncé pour les cartes
    card: '#1A1A24',             // Alias pour backgroundCard

    // Couleurs d'accent
    accent: '#8B5CF6',           // Violet électrique (principal)
    primary: '#8B5CF6',          // Violet principal
    primaryDark: '#7C3AED',      // Violet plus foncé
    secondary: '#EC4899',        // Rose vif

    // Textes
    text: '#F9FAFB',             // Blanc pur
    textSecondary: '#9CA3AF',    // Gris neutre

    // Bordures
    border: '#27272A',           // Bordures très sombres

    // États
    error: '#F43F5E',            // Rose rouge
    success: '#22C55E',          // Vert lime
    warning: '#FBBF24',          // Jaune vif
    info: '#06B6D4',             // Cyan

    // Niveaux de difficulté
    beginner: '#22C55E',         // Vert pour débutant
    intermediate: '#FBBF24',     // Jaune pour intermédiaire
    advanced: '#F43F5E',         // Rose rouge pour avancé
};

// Export par défaut ET nommé pour compatibilité
export const COLORS = colors;
export default colors;