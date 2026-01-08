import type { ColorScheme } from '@/constants/theme';
import { preferencesStorage } from '@/lib/storage';
import { useCallback, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export function useTheme() {
    const systemColorScheme = useRNColorScheme();
    const [themeSetting, setThemeSetting] = useState<'light' | 'dark' | 'system'>(() =>
        preferencesStorage.getTheme()
    );

    const activeColorScheme: ColorScheme =
        themeSetting === 'system'
            ? (systemColorScheme ?? 'light')
            : themeSetting;

    const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
        setThemeSetting(theme);
        preferencesStorage.setTheme(theme);
    }, []);

    return {
        theme: themeSetting,
        activeColorScheme,
        setTheme,
        isDark: activeColorScheme === 'dark',
    };
}
