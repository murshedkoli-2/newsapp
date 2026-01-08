import { theme } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import type { Post } from '@/types/api';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface ArticleCardProps {
    article: Post;
    variant?: 'default' | 'compact';
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
    const router = useRouter();
    const { isDark } = useTheme();
    const colors = isDark ? theme.colors.dark : theme.colors.light;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const handlePress = () => {
        router.push(`/article/${article.slug}`);
    };

    if (variant === 'compact') {
        return (
            <Pressable
                onPress={handlePress}
                style={({ pressed }) => [
                    styles.compactCard,
                    { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
                ]}
            >
                {article.featuredImage && (
                    <Image
                        source={{ uri: article.featuredImage }}
                        style={styles.compactImage}
                        resizeMode="cover"
                    />
                )}
                <View style={styles.compactContent}>
                    <View style={[styles.categoryBadge, { backgroundColor: colors.primaryLight }]}>
                        <Text style={[styles.categoryText, { color: colors.primary }]}>
                            {article.category.name}
                        </Text>
                    </View>
                    <Text
                        style={[styles.compactTitle, { color: colors.text }]}
                        numberOfLines={2}
                    >
                        {article.title}
                    </Text>
                    <View style={styles.meta}>
                        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                            {formatDate(article.publishedAt || article.createdAt)}
                        </Text>
                        {article.readingTime && (
                            <>
                                <Text style={[styles.metaDot, { color: colors.textTertiary }]}>•</Text>
                                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                                    {article.readingTime} min read
                                </Text>
                            </>
                        )}
                    </View>
                </View>
            </Pressable>
        );
    }

    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
                styles.card,
                { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
            ]}
        >
            {article.featuredImage && (
                <Image
                    source={{ uri: article.featuredImage }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}
            <View style={styles.content}>
                <View style={[styles.categoryBadge, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.categoryText, { color: colors.primary }]}>
                        {article.category.name}
                    </Text>
                </View>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={3}>
                    {article.title}
                </Text>
                {article.excerpt && (
                    <Text style={[styles.excerpt, { color: colors.textSecondary }]} numberOfLines={2}>
                        {article.excerpt}
                    </Text>
                )}
                <View style={styles.footer}>
                    <View style={styles.meta}>
                        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                            {article.author.name}
                        </Text>
                        <Text style={[styles.metaDot, { color: colors.textTertiary }]}>•</Text>
                        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                            {formatDate(article.publishedAt || article.createdAt)}
                        </Text>
                        {article.readingTime && (
                            <>
                                <Text style={[styles.metaDot, { color: colors.textTertiary }]}>•</Text>
                                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                                    {article.readingTime} min
                                </Text>
                            </>
                        )}
                    </View>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    image: {
        width: '100%',
        height: 200,
    },
    content: {
        padding: theme.spacing.md,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
        marginBottom: theme.spacing.sm,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
    },
    title: {
        ...theme.typography.h4,
        marginBottom: theme.spacing.sm,
    },
    excerpt: {
        ...theme.typography.bodySmall,
        marginBottom: theme.spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        ...theme.typography.caption,
    },
    metaDot: {
        marginHorizontal: 4,
        ...theme.typography.caption,
    },
    compactCard: {
        flexDirection: 'row',
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
        ...theme.shadows.sm,
    },
    compactImage: {
        width: 120,
        height: 120,
    },
    compactContent: {
        flex: 1,
        padding: theme.spacing.md,
        justifyContent: 'space-between',
    },
    compactTitle: {
        ...theme.typography.body,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
});
