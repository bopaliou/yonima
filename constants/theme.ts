/**
 * YONIMA Design System
 * Brand Colors: Navy Blue (#1A3A4A), Cyan (#00BCD4), Orange (#F5A623)
 */

import { Platform } from 'react-native';

// YONIMA Brand Colors (extracted from logo)
export const BrandColors = {
  navyBlue: '#1B5E6B',      // Primary - Teal blue from logo Y
  navyDark: '#144550',      // Darker teal for contrast
  cyan: '#00BCD4',          // Accent - Links, highlights
  cyanLight: '#4DD0E1',     // Light cyan for hover states
  orange: '#F28C00',        // Action - Exact orange from logo arrow
  orangeLight: '#FFA726',   // Light orange for active states
  white: '#FFFFFF',
  offWhite: '#F5F7FA',
};

const tintColorLight = BrandColors.cyan;
const tintColorDark = BrandColors.cyan;

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
