export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    isBreaking: boolean;
    isFeatured: boolean;
    district?: string;
    upazila?: string;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        name: string;
        image?: string;
    };
    category: Category;
    tags?: string[];
    viewCount?: number;
    readingTime?: number;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;
    icon?: string;
    postCount?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface AppSettings {
    maintenanceMode: boolean;
    contactEmail?: string;
    contactPhone?: string;
    aboutUs?: string;
    privacyPolicyUrl?: string;
    termsOfServiceUrl?: string;
}

export interface District {
    id: string;
    name: string;
    bnName: string;
    upazilas: Upazila[];
}

export interface Upazila {
    id: string;
    name: string;
    bnName: string;
}

export interface FetchPostsParams {
    page?: number;
    limit?: number;
    category?: string;
    district?: string;
    upazila?: string;
    search?: string;
    isBreaking?: boolean;
    isFeatured?: boolean;
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    district?: string;
    upazila?: string;
    notificationsEnabled: boolean;
}

export interface Bookmark {
    postId: string;
    post: Post;
    savedAt: string;
}
