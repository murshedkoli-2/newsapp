import { ArticleCard } from '@/components/ui/ArticleCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { theme } from '@/constants/theme';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookmarksScreen() {
    const { isDark } = useTheme();
    const colors = isDark ? theme.colors.dark : theme.colors.light;
    const { bookmarks, removeBookmark } = useBookmarks();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Bookmarks</Text>
                {bookmarks.length > 0 && (
                    <Text style={[styles.count, { color: colors.textSecondary }]}>
                        {bookmarks.length} saved
                    </Text>
                )}
            </View>
            <FlatList
                data={bookmarks}
                renderItem={({ item }) => (
                    <View style={styles.bookmarkItem}>
                        <View style={styles.articleContainer}>
                            <ArticleCard article={item.post} variant="compact" />
                        </View>
                        <Pressable
                            onPress={() => removeBookmark(item.postId)}
                            style={({ pressed }) => [
                                styles.deleteButton,
                                { backgroundColor: colors.error, opacity: pressed ? 0.7 : 1 },
                            ]}
                        >
                            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
                        </Pressable>
                    </View>
                )}
                keyExtractor={(item) => item.postId}
                ListEmptyComponent={
                    <EmptyState
                        icon="bookmark-outline"
                        title="No bookmarks yet"
                        description="Save articles to read them later"
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
    title: {
        ...theme.typography.h2,
    },
    count: {
        ...theme.typography.body,
    },
    content: {
        paddingHorizontal: theme.spacing.md,
    },
    bookmarkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    articleContainer: {
        flex: 1,
    },
    deleteButton: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: theme.spacing.sm,
    },
});
