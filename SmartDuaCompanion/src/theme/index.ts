// src/theme/index.ts
export { colors } from './colors';
export { spacing } from './spacing';
export { typography } from './typography';

// Re-export everything as default
import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export default {
  colors,
  spacing,
  typography,
};