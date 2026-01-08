import { theme } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import type { Post } from '@/types/api';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;

interface FeaturedCarouselProps {
    articles: Post[];
}

export function FeaturedCarousel({ articles }: FeaturedCarouselProps) {
    const router = useRouter();
    const { isDark } = useTheme();
    const colors = isDark ? theme.colors.dark : theme.colors.light;
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / CARD_WIDTH);
        setActiveIndex(index);
    };

    if (articles.length === 0) return null;

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH}
                contentContainerStyle={styles.scrollContent}
            >
                {articles.map((article) => (
                    <Pressable
                        key={article.id}
                        onPress={() => router.push(`/article/${article.slug}`)}
                        style={({ pressed }) => [
                            styles.card,
                            { opacity: pressed ? 0.8 : 1 },
                        ]}
                    >
                        <Image
                            source={{ uri: article.featuredImage || 'https://via.placeholder.com/400x250' }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                            style={styles.gradient}
                        >
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>FEATURED</Text>
                            </View>
                            <Text style={styles.title} numberOfLines={2}>
                                {article.title}
                            </Text>
                            <View style={styles.meta}>
                                <Text style={styles.category}>{article.category.name}</Text>
                                <Text style={styles.metaDot}>•</Text>
                                <Text style={styles.metaText}>{article.author.name}</Text>
                            </View>
                        </LinearGradient>
                    </Pressable>
                ))}
            </ScrollView>

            {articles.length > 1 && (
                <View style={styles.pagination}>
                    {articles.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: index === activeIndex ? colors.primary : colors.textTertiary,
                                    width: index === activeIndex ? 24 : 8,
                                },
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.lg,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.md,
    },
    card: {
        width: CARD_WIDTH,
        height: 250,
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        marginRight: theme.spacing.md,
        ...theme.shadows.lg,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: theme.spacing.md,
        justifyContent: 'flex-end',
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(239, 68, 68, 0.9)',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
        marginBottom: theme.spacing.sm,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    title: {
        color: '#FFFFFF',
        ...theme.typography.h3,
        marginBottom: theme.spacing.xs,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    category: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    metaDot: {
        color: 'rgba(255, 255, 255, 0.6)',
        marginHorizontal: 6,
    },
    metaText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing.md,
        gap: 6,
    },
    dot: {
        height: 8,
        borderRadius: theme.borderRadius.full,
        transition: 'all 0.3s',
    },
});
