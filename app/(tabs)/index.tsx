import { ArticleCard } from '@/components/ui/ArticleCard';
import { BreakingNewsTicker } from '@/components/ui/BreakingNewsTicker';
import { EmptyState } from '@/components/ui/EmptyState';
import { FeaturedCarousel } from '@/components/ui/FeaturedCarousel';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { theme } from '@/constants/theme';
import { useArticles, useBreakingNews, useFeaturedArticles } from '@/hooks/useArticles';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

export default function HomeScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  const {
    data: articlesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useArticles();

  const { data: featuredData } = useFeaturedArticles();
  const { data: breakingData } = useBreakingNews();

  const articles = articlesData?.pages.flatMap((page) => page.data) ?? [];
  const featuredArticles = featuredData?.data ?? [];
  const breakingArticles = breakingData?.data ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderHeader = () => (
    <>
      {breakingArticles.length > 0 && <BreakingNewsTicker articles={breakingArticles} />}
      {featuredArticles.length > 0 && <FeaturedCarousel articles={featuredArticles} />}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Latest News</Text>
      </View>
    </>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.primary }]}>IMPULSE</Text>
          <View style={styles.headerActions}>
            <Pressable onPress={() => router.push('/search')}>
              <Ionicons name="search" size={24} color={colors.text} />
            </Pressable>
          </View>
        </View>
        <FlatList
          data={[1, 2, 3]}
          renderItem={() => <SkeletonLoader />}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={styles.content}
        />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.primary }]}>IMPULSE</Text>
        </View>
        <EmptyState
          icon="cloud-offline-outline"
          title="Unable to load news"
          description="Please check your connection and try again"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.logo, { color: colors.primary }]}>IMPULSE</Text>
        <View style={styles.headerActions}>
          <Pressable onPress={() => router.push('/search')} style={styles.iconButton}>
            <Ionicons name="search" size={24} color={colors.text} />
          </Pressable>
        </View>
      </View>
      <FlatList
        data={articles}
        renderItem={({ item }) => <ArticleCard article={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <EmptyState
            icon="newspaper-outline"
            title="No articles yet"
            description="Check back later for updates"
          />
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
  logo: {
    ...theme.typography.h2,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  iconButton: {
    padding: theme.spacing.xs,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
  },
  sectionHeader: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
  },
  footer: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
});
