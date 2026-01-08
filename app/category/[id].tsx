import { ArticleCard } from '@/components/ui/ArticleCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { theme } from '@/constants/theme';
import { useArticles } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategoryFeedScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { isDark } = useTheme();
    const colors = isDark ? theme.colors.dark : theme.colors.light;

    const { data: categories } = useCategories();
    const category = categories?.find((c) => c.id === id);

    const {
        data: articlesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        isRefetching,
    } = useArticles({ category: id });

    const articles = articlesData?.pages.flatMap((page) => page.data) ?? [];

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </Pressable>
                <Text style={[styles.title, { color: colors.text }]}>{category?.name || 'Category'}</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={articles}
                renderItem={({ item }) => <ArticleCard article={item} />}
                keyExtractor={(item) => item.id}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={
                    isLoading ? null : (
                        <EmptyState
                            icon="newspaper-outline"
                            title="No articles"
                            description="No articles in this category yet"
                        />
                    )
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
    },
    backButton: {
        padding: theme.spacing.xs,
    },
    title: {
        ...theme.typography.h3,
    },
    content: {
        paddingHorizontal: theme.spacing.md,
    },
    footer: {
        paddingVertical: theme.spacing.lg,
        alignItems: 'center',
    },
});
