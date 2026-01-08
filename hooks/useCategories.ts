import { apiClient } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => apiClient.fetchCategories(),
        staleTime: 1000 * 60 * 30, // 30 minutes - categories don't change often
    });
}
