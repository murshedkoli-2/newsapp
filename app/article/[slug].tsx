import { EmptyState } from '@/components/ui/EmptyState';
import { theme } from '@/constants/theme';
import { useArticleDetail } from '@/hooks/useArticleDetail';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useTheme } from '@/hooks/useTheme';
import { apiClient } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ArticleDetailScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { isDark } = useTheme();
    const colors = isDark ? theme.colors.dark : theme.colors.light;
    const { data: article, isLoading, isError } = useArticleDetail(slug);
    const { isBookmarked, toggleBookmark } = useBookmarks();

    useEffect(() => {
        if (article) {
            // Track analytics
            apiClient.sendAnalytics(article.id).catch(console.error);
        }
    }, [article]);

    const handleShare = async () => {
        if (!article) return;
        try {
            await Share.share({
                message: `${article.title}\n\nRead more on IMPULSE News`,
                title: article.title,
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </Pressable>
                </View>
                <View style={styles.loading}>
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (isError || !article) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </Pressable>
                </View>
                <EmptyState
                    icon="alert-circle-outline"
                    title="Article not found"
                    description="This article may have been removed"
                />
            </SafeAreaView>
        );
    }

    const bookmarked = isBookmarked(article.id);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </Pressable>
                <View style={styles.headerActions}>
                    <Pressable onPress={() => toggleBookmark(article)} style={styles.headerButton}>
                        <Ionicons
                            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                            size={24}
                            color={bookmarked ? colors.primary : colors.text}
                        />
                    </Pressable>
                    <Pressable onPress={handleShare} style={styles.headerButton}>
                        <Ionicons name="share-outline" size={24} color={colors.text} />
                    </Pressable>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {article.featuredImage && (
                    <Image
                        source={{ uri: article.featuredImage }}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                )}

                <View style={styles.articleContent}>
                    <View style={[styles.categoryBadge, { backgroundColor: colors.primaryLight }]}>
                        <Text style={[styles.categoryText, { color: colors.primary }]}>
                            {article.category.name}
                        </Text>
                    </View>

                    <Text style={[styles.title, { color: colors.text }]}>{article.title}</Text>

                    <View style={styles.meta}>
                        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                            By {article.author.name}
                        </Text>
                        <Text style={[styles.metaDot, { color: colors.textTertiary }]}>•</Text>
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

                    <View style={styles.divider} />

                    <RenderHTML
                        contentWidth={width - theme.spacing.md * 2}
                        source={{ html: article.content }}
                        baseStyle={{
                            color: colors.text,
                            fontSize: 16,
                            lineHeight: 26,
                        }}
                        tagsStyles={{
                            p: { marginBottom: 16, color: colors.text },
                            h1: { ...theme.typography.h1, color: colors.text, marginBottom: 12 },
                            h2: { ...theme.typography.h2, color: colors.text, marginBottom: 12 },
                            h3: { ...theme.typography.h3, color: colors.text, marginBottom: 12 },
                            a: { color: colors.primary },
                            img: { marginVertical: 16 },
                        }}
                    />

                    {/* Related News Section - Placeholder for now */}
                    <View style={styles.relatedSection}>
                        <Text style={[styles.relatedTitle, { color: colors.text }]}>Related News</Text>
                        <Text style={[styles.relatedPlaceholder, { color: colors.textSecondary }]}>
                            Related articles will appear here
                        </Text>
                    </View>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    headerButton: {
        padding: theme.spacing.xs,
    },
    headerActions: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...theme.typography.body,
    },
    content: {
        paddingBottom: theme.spacing.xl,
    },
    heroImage: {
        width: '100%',
        height: 250,
    },
    articleContent: {
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.md,
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
        ...theme.typography.h2,
        marginBottom: theme.spacing.md,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    metaText: {
        ...theme.typography.caption,
    },
    metaDot: {
        marginHorizontal: 4,
        ...theme.typography.caption,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginBottom: theme.spacing.lg,
    },
    relatedSection: {
        marginTop: theme.spacing.xl,
    },
    relatedTitle: {
        ...theme.typography.h3,
        marginBottom: theme.spacing.md,
    },
    relatedPlaceholder: {
        ...theme.typography.body,
        textAlign: 'center',
        padding: theme.spacing.xl,
    },
});
