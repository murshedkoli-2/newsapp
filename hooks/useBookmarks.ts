import { bookmarksStorage } from '@/lib/storage';
import type { Bookmark, Post } from '@/types/api';
import { useCallback, useState } from 'react';

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => bookmarksStorage.getAll());

    const addBookmark = useCallback((post: Post) => {
        bookmarksStorage.add(post);
        setBookmarks(bookmarksStorage.getAll());
    }, []);

    const removeBookmark = useCallback((postId: string) => {
        bookmarksStorage.remove(postId);
        setBookmarks(bookmarksStorage.getAll());
    }, []);

    const isBookmarked = useCallback((postId: string) => {
        return bookmarksStorage.isBookmarked(postId);
    }, []);

    const toggleBookmark = useCallback((post: Post) => {
        if (isBookmarked(post.id)) {
            removeBookmark(post.id);
        } else {
            addBookmark(post);
        }
    }, [isBookmarked, addBookmark, removeBookmark]);

    return {
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        toggleBookmark,
    };
}
