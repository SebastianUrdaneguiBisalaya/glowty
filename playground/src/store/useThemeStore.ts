import { create } from 'zustand';
import themes from '@/constants/themes';

type ThemeType = 'light' | 'dark';

interface ThemeState {
  theme: ThemeType;
  themes: (typeof themes)['light'];
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  themes: themes.light,
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: newTheme, themes: themes[newTheme] });
  },
  setTheme: theme => {
    set({ theme, themes: themes[theme] });
  },
}));
