import type { Bookmark, Post, UserPreferences } from '@/types/api';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

type StorageLike = {
    getString: (key: string) => string | undefined;
    getBoolean: (key: string) => boolean | undefined;
    set: (key: string, value: string | boolean | number) => void;
    delete: (key: string) => void;
};

class MemoryStorage implements StorageLike {
    private store = new Map<string, string | boolean | number>();

    getString(key: string): string | undefined {
        const value = this.store.get(key);
        return typeof value === 'string' ? value : undefined;
    }

    getBoolean(key: string): boolean | undefined {
        const value = this.store.get(key);
        return typeof value === 'boolean' ? value : undefined;
    }

    set(key: string, value: string | boolean | number): void {
        this.store.set(key, value);
    }

    delete(key: string): void {
        this.store.delete(key);
    }
}

let storageInstance: StorageLike;

if (Platform.OS === 'web' || Constants.appOwnership === 'expo') {
    storageInstance = new MemoryStorage();
} else {
    try {
        const { createMMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
        const mmkv = createMMKV();
        storageInstance = {
            getString: (key) => mmkv.getString(key),
            getBoolean: (key) => mmkv.getBoolean(key),
            set: (key, value) => mmkv.set(key, value),
            delete: (key) => {
                mmkv.remove(key);
            },
        };
    } catch {
        storageInstance = new MemoryStorage();
    }
}

export const storage = storageInstance;

// Storage Keys
const KEYS = {
    BOOKMARKS: 'bookmarks',
    PREFERENCES: 'preferences',
    ONBOARDING_COMPLETED: 'onboarding_completed',
    CACHED_POSTS: 'cached_posts',
} as const;

// Bookmarks Management
export const bookmarksStorage = {
    getAll(): Bookmark[] {
        const data = storage.getString(KEYS.BOOKMARKS);
        return data ? JSON.parse(data) : [];
    },

    add(post: Post): void {
        const bookmarks = this.getAll();
        const bookmark: Bookmark = {
            postId: post.id,
            post,
            savedAt: new Date().toISOString(),
        };

        // Avoid duplicates
        if (!bookmarks.find(b => b.postId === post.id)) {
            bookmarks.unshift(bookmark);
            storage.set(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
        }
    },

    remove(postId: string): void {
        const bookmarks = this.getAll();
        const filtered = bookmarks.filter(b => b.postId !== postId);
        storage.set(KEYS.BOOKMARKS, JSON.stringify(filtered));
    },

    isBookmarked(postId: string): boolean {
        const bookmarks = this.getAll();
        return bookmarks.some(b => b.postId === postId);
    },

    clear(): void {
        storage.delete(KEYS.BOOKMARKS);
    },
};

// User Preferences
export const preferencesStorage = {
    get(): UserPreferences {
        const data = storage.getString(KEYS.PREFERENCES);
        return data ? JSON.parse(data) : {
            theme: 'system',
            notificationsEnabled: true,
        };
    },

    set(preferences: Partial<UserPreferences>): void {
        const current = this.get();
        const updated = { ...current, ...preferences };
        storage.set(KEYS.PREFERENCES, JSON.stringify(updated));
    },

    getTheme(): 'light' | 'dark' | 'system' {
        return this.get().theme;
    },

    setTheme(theme: 'light' | 'dark' | 'system'): void {
        this.set({ theme });
    },

    getLocation(): { district?: string; upazila?: string } {
        const prefs = this.get();
        return {
            district: prefs.district,
            upazila: prefs.upazila,
        };
    },

    setLocation(district?: string, upazila?: string): void {
        this.set({ district, upazila });
    },
};

// Onboarding
export const onboardingStorage = {
    isCompleted(): boolean {
        return storage.getBoolean(KEYS.ONBOARDING_COMPLETED) ?? false;
    },

    setCompleted(completed: boolean = true): void {
        storage.set(KEYS.ONBOARDING_COMPLETED, completed);
    },
};

// Offline Content Cache
export const cacheStorage = {
    savePost(post: Post): void {
        const cached = this.getAllPosts();
        const index = cached.findIndex(p => p.id === post.id);

        if (index >= 0) {
            cached[index] = post;
        } else {
            cached.push(post);
        }

        storage.set(KEYS.CACHED_POSTS, JSON.stringify(cached));
    },

    getPost(postId: string): Post | null {
        const cached = this.getAllPosts();
        return cached.find(p => p.id === postId) || null;
    },

    getAllPosts(): Post[] {
        const data = storage.getString(KEYS.CACHED_POSTS);
        return data ? JSON.parse(data) : [];
    },

    clear(): void {
        storage.delete(KEYS.CACHED_POSTS);
    },
};

export default storage;
