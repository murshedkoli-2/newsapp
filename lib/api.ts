import type { AppSettings, Category, FetchPostsParams, PaginatedResponse, Post } from '@/types/api';

// Default to localhost for development - update this for production
const API_BASE_URL = 'https://newsadmin-indol.vercel.app/api/public';

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
            });

            if (!response.ok) {
                // Log error but don't throw for 500 to avoid infinite retry loops
                if (response.status === 500) {
                    console.error('API 500 error, returning empty data to prevent crashes');
                    // Return a safe empty structure for posts endpoint
                    if (endpoint.includes('/posts')) {
                        return {
                            data: [],
                            pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
                        } as T;
                    }
                    // For other endpoints, return empty array or safe fallback
                    return [] as T;
                }
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            // Transform admin response shape to our PaginatedResponse shape
            if ('posts' in result && 'meta' in result) {
                return {
                    data: result.posts,
                    pagination: {
                        page: result.meta.page,
                        limit: result.meta.limit,
                        total: result.meta.total,
                        totalPages: result.meta.totalPages,
                    },
                } as T;
            }
            return result;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    async fetchPosts(params: FetchPostsParams = {}): Promise<PaginatedResponse<Post>> {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.category) queryParams.append('category', params.category);
        if (params.district) queryParams.append('district', params.district);
        if (params.upazila) queryParams.append('upazila', params.upazila);
        if (params.search) queryParams.append('search', params.search);
        if (params.isBreaking !== undefined) queryParams.append('isBreaking', params.isBreaking.toString());
        if (params.isFeatured !== undefined) queryParams.append('isFeatured', params.isFeatured.toString());

        const query = queryParams.toString();
        return this.request<PaginatedResponse<Post>>(
            `/posts${query ? `?${query}` : ''}`
        );
    }

    async fetchPostBySlug(slug: string): Promise<Post> {
        return this.request<Post>(`/posts/${slug}`);
    }

    async fetchCategories(): Promise<Category[]> {
        return this.request<Category[]>('/categories');
    }

    async sendAnalytics(postId: string): Promise<void> {
        await this.request('/analytics', {
            method: 'POST',
            body: JSON.stringify({ postId, action: 'view' }),
        });
    }

    async registerPushToken(token: string): Promise<void> {
        await this.request('/push-tokens', {
            method: 'POST',
            body: JSON.stringify({ token }),
        });
    }

    async fetchAppSettings(): Promise<AppSettings> {
        return this.request<AppSettings>('/settings');
    }
}

export const apiClient = new ApiClient();
export default apiClient;
