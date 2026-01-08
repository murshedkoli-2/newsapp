import { apiClient } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export function useArticleDetail(slug: string) {
    return useQuery({
        queryKey: ['article', slug],
        queryFn: () => apiClient.fetchPostBySlug(slug),
        enabled: !!slug,
    });
}
