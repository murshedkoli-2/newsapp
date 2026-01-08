import locations from '@/constants/locations.json';
import { theme } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { preferencesStorage } from '@/lib/storage';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const { isDark, theme: themeSetting, setTheme, activeColorScheme } = useTheme();
    const colors = isDark ? theme.colors.dark : theme.colors.light;
    const [location, setLocation] = React.useState(preferencesStorage.getLocation());

    const handleThemeChange = () => {
        const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(themeSetting);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        setTheme(nextTheme);
    };

    const handleLocationChange = () => {
        // Cycle through districts
        const currentIndex = locations.findIndex((d) => d.id === location.district);
        const nextIndex = (currentIndex + 1) % locations.length;
        const newLocation = {
            district: locations[nextIndex].id,
            upazila: undefined,
        };
        setLocation(newLocation);
        preferencesStorage.setLocation(newLocation.district, newLocation.upazila);
    };

    const selectedDistrict = locations.find((d) => d.id === location.district);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>

                    <Pressable
                        onPress={handleThemeChange}
                        style={[styles.settingItem, { backgroundColor: colors.surface }]}
                    >
                        <View style={styles.settingLeft}>
                            <Ionicons
                                name={themeSetting === 'dark' ? 'moon' : themeSetting === 'light' ? 'sunny' : 'contrast'}
                                size={24}
                                color={colors.primary}
                            />
                            <View style={styles.settingText}>
                                <Text style={[styles.settingLabel, { color: colors.text }]}>Theme</Text>
                                <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                                    {themeSetting === 'system' ? 'System' : themeSetting === 'dark' ? 'Dark' : 'Light'}
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Location</Text>

                    <Pressable
                        onPress={handleLocationChange}
                        style={[styles.settingItem, { backgroundColor: colors.surface }]}
                    >
                        <View style={styles.settingLeft}>
                            <Ionicons name="location" size={24} color={colors.primary} />
                            <View style={styles.settingText}>
                                <Text style={[styles.settingLabel, { color: colors.text }]}>Preferred District</Text>
                                <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                                    {selectedDistrict?.name || 'Not set'}
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>

                    <View style={[styles.settingItem, { backgroundColor: colors.surface }]}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="information-circle" size={24} color={colors.primary} />
                            <View style={styles.settingText}>
                                <Text style={[styles.settingLabel, { color: colors.text }]}>Version</Text>
                                <Text style={[styles.settingValue, { color: colors.textSecondary }]}>1.0.0</Text>
                            </View>
                        </View>
                    </View>

                    <Pressable style={[styles.settingItem, { backgroundColor: colors.surface }]}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
                            <Text style={[styles.settingLabel, { color: colors.text }]}>Privacy Policy</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                    </Pressable>

                    <Pressable style={[styles.settingItem, { backgroundColor: colors.surface }]}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="mail" size={24} color={colors.primary} />
                            <Text style={[styles.settingLabel, { color: colors.text }]}>Contact Us</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
    },
    title: {
        ...theme.typography.h2,
    },
    content: {
        paddingHorizontal: theme.spacing.md,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        ...theme.typography.h4,
        marginBottom: theme.spacing.md,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.sm,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingText: {
        marginLeft: theme.spacing.md,
        flex: 1,
    },
    settingLabel: {
        ...theme.typography.body,
        fontWeight: '500',
    },
    settingValue: {
        ...theme.typography.bodySmall,
        marginTop: 2,
    },
});
