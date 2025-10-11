import { colors } from '@/constants/colors';

const themes = {
  dark: {
    background: colors.black,
    typography: {
      'display': colors.neutral[50],
      'h1': colors.neutral[50],
      'h2': colors.neutral[100],
      'h3': colors.neutral[200],
      'subtitle': colors.neutral[300],
      'body-large': colors.neutral[300],
      'body-small': colors.neutral[400],
      'button': colors.neutral[800],
      'caption': colors.neutral[500],
      'overline': colors.neutral[600],
    },
    border: {
      light: colors.neutral[700],
      main: colors.neutral[600],
    },
    toast: {
      background: colors.neutral[800],
      color: colors.neutral[100],
    },
  },
  light: {
    background: colors.white,
    typography: {
      'display': colors.neutral[900],
      'h1': colors.neutral[900],
      'h2': colors.neutral[900],
      'h3': colors.neutral[800],
      'subtitle': colors.neutral[700],
      'body-large': colors.neutral[700],
      'body-small': colors.neutral[600],
      'button': colors.white,
      'caption': colors.neutral[500],
      'overline': colors.neutral[400],
    },
    border: {
      light: colors.neutral[300],
      main: colors.neutral[400],
    },
    toast: {
      background: colors.neutral[100],
      color: colors.neutral[900],
    },
  },
};

export default themes;
