import { EmptyState } from '@/components/ui/EmptyState';
import { theme } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { useTheme } from '@/hooks/useTheme';
import type { Category } from '@/types/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategoriesScreen() {
    const router = useRouter();
    const { isDark } = useTheme();
    const colors = isDark ? theme.colors.dark : theme.colors.light;
    const { data: categories, isLoading } = useCategories();

    const renderCategory = ({ item }: { item: Category }) => (
        <Pressable
            onPress={() => router.push(`/category/${item.id}` as any)}
            style={({ pressed }) => [
                styles.categoryCard,
                { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
            ]}
        >
            <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="newspaper-outline" size={32} color={colors.primary} />
            </View>
            <View style={styles.categoryInfo}>
                <Text style={[styles.categoryName, { color: colors.text }]}>{item.name}</Text>
                {item.description && (
                    <Text style={[styles.categoryDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                        {item.description}
                    </Text>
                )}
                {item.postCount !== undefined && (
                    <Text style={[styles.postCount, { color: colors.textTertiary }]}>
                        {item.postCount} articles
                    </Text>
                )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </Pressable>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Categories</Text>
            </View>
            <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <EmptyState
                        icon="grid-outline"
                        title="No categories"
                        description="Categories will appear here"
                    />
                }
                contentContainerStyle={styles.content}
            />
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
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryName: {
        ...theme.typography.h4,
        marginBottom: 4,
    },
    categoryDescription: {
        ...theme.typography.bodySmall,
        marginBottom: 4,
    },
    postCount: {
        ...theme.typography.caption,
    },
});
