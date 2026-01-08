import { theme } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export function SkeletonLoader() {
    const { isDark } = useTheme();
    const colors = isDark ? theme.colors.dark : theme.colors.light;
    const animatedValue = new Animated.Value(0);

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.imageSkeleton,
                    { backgroundColor: colors.surfaceVariant, opacity },
                ]}
            />
            <View style={styles.content}>
                <Animated.View
                    style={[
                        styles.badgeSkeleton,
                        { backgroundColor: colors.surfaceVariant, opacity },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.titleSkeleton,
                        { backgroundColor: colors.surfaceVariant, opacity },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.titleSkeleton,
                        { backgroundColor: colors.surfaceVariant, opacity, width: '60%' },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.textSkeleton,
                        { backgroundColor: colors.surfaceVariant, opacity },
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
    },
    imageSkeleton: {
        width: '100%',
        height: 200,
    },
    content: {
        padding: theme.spacing.md,
    },
    badgeSkeleton: {
        width: 80,
        height: 20,
        borderRadius: theme.borderRadius.sm,
        marginBottom: theme.spacing.sm,
    },
    titleSkeleton: {
        height: 16,
        borderRadius: 4,
        marginBottom: theme.spacing.xs,
    },
    textSkeleton: {
        height: 12,
        borderRadius: 4,
        marginTop: theme.spacing.sm,
    },
});
