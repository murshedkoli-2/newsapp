import { theme } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import type { Post } from '@/types/api';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

interface BreakingNewsTickerProps {
    articles: Post[];
}

export function BreakingNewsTicker({ articles }: BreakingNewsTickerProps) {
    const router = useRouter();
    const { isDark } = useTheme();
    const colors = isDark ? theme.colors.dark : theme.colors.light;
    const scrollX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (articles.length === 0) return;

        const animation = Animated.loop(
            Animated.timing(scrollX, {
                toValue: -1000,
                duration: 20000,
                useNativeDriver: true,
            })
        );

        animation.start();

        return () => animation.stop();
    }, [articles, scrollX]);

    if (articles.length === 0) return null;

    return (
        <View style={[styles.container, { backgroundColor: colors.error }]}>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>BREAKING</Text>
            </View>
            <Animated.View
                style={[
                    styles.scrollContainer,
                    {
                        transform: [{ translateX: scrollX }],
                    },
                ]}
            >
                {articles.map((article, index) => (
                    <Pressable
                        key={article.id}
                        onPress={() => router.push(`/article/${article.slug}`)}
                        style={styles.item}
                    >
                        <Text style={styles.text} numberOfLines={1}>
                            {article.title}
                        </Text>
                        {index < articles.length - 1 && <Text style={styles.separator}>•</Text>}
                    </Pressable>
                ))}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        overflow: 'hidden',
    },
    labelContainer: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        marginRight: theme.spacing.sm,
    },
    label: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: theme.spacing.lg,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    separator: {
        color: '#FFFFFF',
        marginLeft: theme.spacing.lg,
        opacity: 0.6,
    },
});
