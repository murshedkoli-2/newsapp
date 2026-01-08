import { HapticTab } from '@/components/haptic-tab';
import { theme } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

export default function TabLayout() {
  const { isDark, setTheme, theme: themeSetting } = useTheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  const toggleTheme = () => {
    const next = themeSetting === 'light' ? 'dark' : themeSetting === 'dark' ? 'system' : 'light';
    setTheme(next);
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarRight: () => (
          <Pressable onPress={toggleTheme} style={styles.themeToggle}>
            <Ionicons
              name={themeSetting === 'dark' ? 'sunny' : themeSetting === 'light' ? 'moon' : 'contrast'}
              size={20}
              color={colors.primary}
            />
          </Pressable>
        ),
      })}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Bookmarks',
          tabBarIcon: ({ color, size }) => <Ionicons name="bookmark" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  themeToggle: {
    marginRight: 16,
    padding: 4,
  },
});
