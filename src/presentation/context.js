import { createContext } from '@lit/context';

/**
 * Context for the AddBookmarkUseCase.
 * Allows components to inject and use the logic for adding bookmarks.
 * @type {import('@lit/context').Context<unknown, import('../domain/usecases/AddBookmarkUseCase.js').AddBookmarkUseCase>}
 */
export const addBookmarkContext = createContext('add-bookmark-use-case');

/**
 * Context for the GetBookmarksUseCase.
 * Allows components to inject and use the logic for retrieving/searching bookmarks.
 * @type {import('@lit/context').Context<unknown, import('../domain/usecases/GetBookmarksUseCase.js').GetBookmarksUseCase>}
 */
export const getBookmarksContext = createContext('get-bookmarks-use-case');
