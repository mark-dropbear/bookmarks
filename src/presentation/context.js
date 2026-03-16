import { createContext } from '@lit/context';

/**
 * Context for the BookmarkRepository.
 * Allows components to inject the primary bookmark storage.
 * @type {import('@lit/context').Context<unknown, import('../domain/repositories/BookmarkRepository.js').BookmarkRepository>}
 */
export const bookmarkRepositoryContext = createContext('bookmark-repository');

/**
 * Context for the TopicRepository.
 * Allows components to inject the primary topic storage.
 * @type {import('@lit/context').Context<unknown, import('../domain/repositories/TopicRepository.js').TopicRepository>}
 */
export const topicRepositoryContext = createContext('topic-repository');

/**
 * Context for the AddBookmarkUseCase.
 * Allows components to inject and use the logic for adding bookmarks.
 * @type {import('@lit/context').Context<unknown, import('../domain/usecases/AddBookmarkUseCase.js').AddBookmarkUseCase>}
 */
export const addBookmarkContext = createContext('add-bookmark-use-case');

/**
 * Context for the DeleteBookmarkUseCase.
 */
export const deleteBookmarkContext = createContext('delete-bookmark-use-case');

/**
 * Context for the UpdateBookmarkUseCase.
 */
export const updateBookmarkContext = createContext('update-bookmark-use-case');

/**
 * Context for the GetBookmarksUseCase.
 * Allows components to inject and use the logic for retrieving/searching bookmarks.
 * @type {import('@lit/context').Context<unknown, import('../domain/usecases/GetBookmarksUseCase.js').GetBookmarksUseCase>}
 */
export const getBookmarksContext = createContext('get-bookmarks-use-case');
