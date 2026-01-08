import { apiClient } from '@/lib/api';
import type { FetchPostsParams } from '@/types/api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export function useArticles(params: FetchPostsParams = {}) {
    return useInfiniteQuery({
        queryKey: ['articles', params],
        queryFn: ({ pageParam = 1 }) =>
            apiClient.fetchPosts({ ...params, page: pageParam, limit: 10 }),
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage?.pagination ?? {};
            return page && totalPages && page < totalPages ? page + 1 : undefined;
        },
        initialPageParam: 1,
    });
}

export function useFeaturedArticles() {
    return useQuery({
        queryKey: ['articles', 'featured'],
        queryFn: () => apiClient.fetchPosts({ isFeatured: true, limit: 5 }),
    });
}

export function useBreakingNews() {
    return useQuery({
        queryKey: ['articles', 'breaking'],
        queryFn: () => apiClient.fetchPosts({ isBreaking: true, limit: 10 }),
    });
}
