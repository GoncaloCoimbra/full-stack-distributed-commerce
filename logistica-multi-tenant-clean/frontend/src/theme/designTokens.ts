/**
 * Design System Central - Cores, Spacing, Typography
 * Garante consistência visual em toda a aplicação
 */

// ─── Base Colors ───────────────────────────────────────────────────────────
const COLORS = {
  // Backgrounds
  bg: {
    primary: '#07090f',          // Background principal (quase preto)
    secondary: '#080c14',        // Background secundário (um pouco mais claro)
    tertiary: '#0a0d16',         // Background terciário
    card: '#0d1117',             // Cards e containers
    cardHover: '#111820',        // Cards ao hover
    input: '#0a0e17',            // Inputs
    overlay: '#000000cc',        // Overlay semi-transparente
  },

  // Borders
  border: {
    default: '#1a2234',          // Border padrão
    hover: '#253248',            // Border ao hover
    focus: '#4f85f6',            // Border ao focus
  },

  // Text
  text: {
    primary: '#f0f4ff',          // Texto principal
    secondary: '#7a8fa8',        // Texto secundário (labels)
    muted: '#3a4d63',            // Texto mutado (hints)
  },

  // Accents & Actions
  accent: {
    primary: '#4f85f6',          // Azul principal (Login/Register)
    secondary: '#8b5cf6',        // Roxo (Dashboard)
    tertiary: '#6366f1',         // Indigo alternativo
    hover: '#3b6fd4',            // Hover do azul
  },

  // Semantic
  semantic: {
    success: '#34d399',          // Verde (success)
    warning: '#f59e0b',          // Âmbar (warning)
    danger: '#f87171',           // Vermelho (error)
    info: '#4f85f6',             // Azul (informação)
    purple: '#a78bfa',           // Roxo adicional
    orange: '#fb923c',           // Laranja adicional
  },
};

// ─── Design Tokens por Página ──────────────────────────────────────────────
export const DESIGN_TOKENS = {
  // Login & Register - Azul principal
  auth: {
    bg: COLORS.bg.primary,
    bgCard: COLORS.bg.card,
    bgInput: COLORS.bg.input,
    border: COLORS.border.default,
    borderFocus: COLORS.border.focus,
    accent: COLORS.accent.primary,      // #4f85f6 Azul
    accentHover: COLORS.accent.hover,
    textPrimary: COLORS.text.primary,
    textSecondary: COLORS.text.secondary,
    textMuted: COLORS.text.muted,
    success: COLORS.semantic.success,
    danger: COLORS.semantic.danger,
    warning: COLORS.semantic.warning,
  },

  // Dashboard - Roxo diferenciado
  dashboard: {
    bg: COLORS.bg.primary,
    bgCard: COLORS.bg.card,
    bgCardHover: COLORS.bg.cardHover,
    bgInput: COLORS.bg.input,
    border: COLORS.border.default,
    borderHover: COLORS.border.hover,
    accent: COLORS.accent.secondary,    // #8b5cf6 Roxo - DIFERENTE de Login!
    accentGlow: 'rgba(139,92,246,0.15)',
    textPrimary: COLORS.text.primary,
    textSecondary: COLORS.text.secondary,
    textMuted: COLORS.text.muted,
    success: COLORS.semantic.success,
    warning: COLORS.semantic.warning,
    danger: COLORS.semantic.danger,
    purple: COLORS.semantic.purple,
    orange: COLORS.semantic.orange,
  },

  // SuperAdmin - Indigo diferenciado
  superAdmin: {
    bg: COLORS.bg.primary,
    bgCard: COLORS.bg.card,
    bgInput: COLORS.bg.input,
    border: COLORS.border.default,
    accent: COLORS.accent.tertiary,     // #6366f1 Indigo - DIFERENTE de Login e Dashboard!
    textPrimary: COLORS.text.primary,
    textSecondary: COLORS.text.secondary,
    textMuted: COLORS.text.muted,
    success: COLORS.semantic.success,
    danger: COLORS.semantic.danger,
    warning: COLORS.semantic.warning,
  },

  // Filters & Advanced - Mesmo do Dashboard
  filters: {
    bg: COLORS.bg.primary,
    bgCard: COLORS.bg.card,
    bgInput: COLORS.bg.input,
    border: COLORS.border.default,
    accent: COLORS.accent.secondary,    // Roxo
    textPrimary: COLORS.text.primary,
    textSecondary: COLORS.text.secondary,
    textMuted: COLORS.text.muted,
    success: COLORS.semantic.success,
    danger: COLORS.semantic.danger,
  },
};

// ─── Spacing ───────────────────────────────────────────────────────────────
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
};

// ─── Typography ────────────────────────────────────────────────────────────
export const TYPOGRAPHY = {
  fontFamily: "'Outfit', -apple-system, sans-serif",
  monoFamily: "'DM Mono', monospace",
  
  heading: {
    h1: { size: '32px', weight: '700' },
    h2: { size: '28px', weight: '600' },
    h3: { size: '24px', weight: '600' },
  },
  
  body: {
    large: { size: '16px', weight: '400' },
    regular: { size: '14px', weight: '400' },
    small: { size: '12px', weight: '400' },
  },
  
  label: { size: '12px', weight: '600', textTransform: 'uppercase', letterSpacing: 'wider' },
};

// ─── Component Classes ────────────────────────────────────────────────────
export const COMPONENT_CLASSES = {
  inputBase: `w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none`,
  
  inputAuth: `w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none
    bg-[#0a0e17] border border-[#1a2234] text-[#f0f4ff] placeholder-[#3a4d63]
    focus:border-[#4f85f6] focus:ring-2 focus:ring-[#4f85f6]/10`,
  
  inputDashboard: `w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none
    bg-[#0a0e17] border border-[#1a2234] text-[#f0f4ff] placeholder-[#3a4d63]
    focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/10`,
  
  labelClass: `block text-xs font-semibold uppercase tracking-wider mb-2`,
  
  buttonPrimary: `font-medium py-3 rounded-xl transition-all duration-200 text-sm`,
  buttonSecondary: `font-medium py-2 px-4 rounded-lg transition-all duration-200 text-xs`,
};

// ─── Gradients ────────────────────────────────────────────────────────────
export const GRADIENTS = {
  authBg: 'linear-gradient(135deg, #07090f 0%, #0a0d16 100%)',
  dashboardBg: 'linear-gradient(135deg, #07090f 0%, #0f0f1a 100%)',
  accentAuth: 'linear-gradient(135deg, #4f85f6 0%, #3b6fd4 100%)',
  accentDashboard: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  accentSuper: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
};

// ─── Shadows ────────────────────────────────────────────────────────────
export const SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
  md: '0 4px 6px rgba(0, 0, 0, 0.5)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.6)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.7)',
};

// ─── Export Presets ────────────────────────────────────────────────────────
export default {
  colors: COLORS,
  tokens: DESIGN_TOKENS,
  spacing: SPACING,
  typography: TYPOGRAPHY,
  components: COMPONENT_CLASSES,
  gradients: GRADIENTS,
  shadows: SHADOWS,
};
