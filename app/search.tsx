import { ArticleCard } from '@/components/ui/ArticleCard';
import { EmptyState } from '@/components/ui/EmptyState';
import locations from '@/constants/locations.json';
import { theme } from '@/constants/theme';
import { useArticles } from '@/hooks/useArticles';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
    const router = useRouter();
    const { isDark } = useTheme();
    const colors = isDark ? theme.colors.dark : theme.colors.light;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>();
    const [selectedUpazila, setSelectedUpazila] = useState<string>();
    const [isSearching, setIsSearching] = useState(false);

    const {
        data: searchResults,
        isLoading,
        refetch,
    } = useArticles({
        search: searchQuery,
        district: selectedDistrict,
        upazila: selectedUpazila,
    });

    const articles = searchResults?.pages.flatMap((page) => page.data) ?? [];
    const selectedDistrictData = locations.find((d) => d.id === selectedDistrict);

    const handleSearch = () => {
        setIsSearching(true);
        refetch().finally(() => setIsSearching(false));
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </Pressable>
                <Text style={[styles.title, { color: colors.text }]}>Search</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Ionicons name="search" size={20} color={colors.textSecondary} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search news..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <Pressable onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                        </Pressable>
                    )}
                </View>

                <View style={styles.filters}>
                    <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Filter by location:</Text>

                    <View style={styles.filterRow}>
                        <View style={styles.filterItem}>
                            <Text style={[styles.filterItemLabel, { color: colors.text }]}>District</Text>
                            <View style={[styles.select, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <Pressable
                                    style={styles.selectButton}
                                    onPress={() => {
                                        // In a real app, this would open a picker/modal
                                        // For now, we'll just cycle through options
                                        const currentIndex = locations.findIndex((d) => d.id === selectedDistrict);
                                        const nextIndex = (currentIndex + 1) % locations.length;
                                        setSelectedDistrict(locations[nextIndex].id);
                                        setSelectedUpazila(undefined);
                                    }}
                                >
                                    <Text style={[styles.selectText, { color: selectedDistrict ? colors.text : colors.textSecondary }]}>
                                        {selectedDistrictData?.name || 'All Districts'}
                                    </Text>
                                    <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                                </Pressable>
                            </View>
                        </View>

                        {selectedDistrict && (
                            <View style={styles.filterItem}>
                                <Text style={[styles.filterItemLabel, { color: colors.text }]}>Upazila</Text>
                                <View style={[styles.select, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <Pressable
                                        style={styles.selectButton}
                                        onPress={() => {
                                            const upazilas = selectedDistrictData?.upazilas || [];
                                            const currentIndex = upazilas.findIndex((u) => u.id === selectedUpazila);
                                            const nextIndex = (currentIndex + 1) % upazilas.length;
                                            setSelectedUpazila(upazilas[nextIndex].id);
                                        }}
                                    >
                                        <Text style={[styles.selectText, { color: selectedUpazila ? colors.text : colors.textSecondary }]}>
                                            {selectedDistrictData?.upazilas.find((u) => u.id === selectedUpazila)?.name || 'All Upazilas'}
                                        </Text>
                                        <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                                    </Pressable>
                                </View>
                            </View>
                        )}
                    </View>

                    {(selectedDistrict || selectedUpazila) && (
                        <Pressable
                            onPress={() => {
                                setSelectedDistrict(undefined);
                                setSelectedUpazila(undefined);
                            }}
                            style={styles.clearButton}
                        >
                            <Text style={[styles.clearButtonText, { color: colors.primary }]}>Clear Filters</Text>
                        </Pressable>
                    )}
                </View>
            </View>

            {isLoading || isSearching ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={articles}
                    renderItem={({ item }) => <ArticleCard article={item} variant="compact" />}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={
                        <EmptyState
                            icon="search-outline"
                            title="No results found"
                            description={searchQuery ? `No articles found for "${searchQuery}"` : 'Start searching for news'}
                        />
                    }
                    contentContainerStyle={styles.content}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
    },
    backButton: {
        marginRight: theme.spacing.md,
    },
    title: {
        ...theme.typography.h3,
    },
    searchContainer: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        gap: theme.spacing.sm,
    },
    searchInput: {
        flex: 1,
        ...theme.typography.body,
    },
    filters: {
        marginTop: theme.spacing.md,
    },
    filterLabel: {
        ...theme.typography.bodySmall,
        marginBottom: theme.spacing.sm,
    },
    filterRow: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    filterItem: {
        flex: 1,
    },
    filterItemLabel: {
        ...theme.typography.caption,
        marginBottom: 4,
    },
    select: {
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
    },
    selectButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
    },
    selectText: {
        ...theme.typography.bodySmall,
    },
    clearButton: {
        marginTop: theme.spacing.sm,
        alignSelf: 'flex-start',
    },
    clearButtonText: {
        ...theme.typography.bodySmall,
        fontWeight: '600',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingHorizontal: theme.spacing.md,
    },
});
