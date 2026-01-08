import { theme } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    description?: string;
}

export function EmptyState({ icon = 'document-outline', title, description }: EmptyStateProps) {
    const { isDark } = useTheme();
    const colors = isDark ? theme.colors.dark : theme.colors.light;

    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={64} color={colors.textTertiary} />
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {description && (
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                    {description}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    title: {
        ...theme.typography.h3,
        marginTop: theme.spacing.md,
        textAlign: 'center',
    },
    description: {
        ...theme.typography.body,
        marginTop: theme.spacing.sm,
        textAlign: 'center',
    },
});
