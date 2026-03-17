import { DependencyRegistry } from './core/DependencyRegistry.js';
import { IndexedDBBookmarkRepository } from './data/repositories/IndexedDBBookmarkRepository.js';
import { IndexedDBTopicRepository } from './data/repositories/IndexedDBTopicRepository.js';
import { BrowserThemeRepository } from './data/repositories/BrowserThemeRepository.js';
import { BrowserImageValidationService } from './data/services/BrowserImageValidationService.js';
import { openIndexedDB } from './data/infrastructure/IndexedDBConnection.js';
import { DB_NAME, DB_VERSION, upgradeDatabase } from './data/infrastructure/IndexedDBSchema.js';
import { FaviconDiscovery } from './domain/usecases/FaviconDiscovery.js';
import { AddBookmarkUseCase } from './domain/usecases/AddBookmarkUseCase.js';
import { DeleteBookmarkUseCase } from './domain/usecases/DeleteBookmarkUseCase.js';
import { UpdateBookmarkUseCase } from './domain/usecases/UpdateBookmarkUseCase.js';
import { GetBookmarksUseCase } from './domain/usecases/GetBookmarksUseCase.js';
import { GetThemeUseCase } from './domain/usecases/GetThemeUseCase.js';
import { SetThemeUseCase } from './domain/usecases/SetThemeUseCase.js';

(async () => {
  // 1. Initialize Infrastructure (Persistence)
  const db = await openIndexedDB(DB_NAME, DB_VERSION, { upgrade: upgradeDatabase });
  const bookmarkRepo = new IndexedDBBookmarkRepository(db);
  const topicRepo = new IndexedDBTopicRepository(db);
  
  // 2. Initialize Other Infrastructure
  const themeRepo = new BrowserThemeRepository();
  const imageValidationService = new BrowserImageValidationService();

  // 3. Initialize Domain Services
  const faviconDiscovery = new FaviconDiscovery(imageValidationService);

  // 4. Initialize Use Cases
  const addBookmarkUseCase = new AddBookmarkUseCase(bookmarkRepo, topicRepo, faviconDiscovery);
  const deleteBookmarkUseCase = new DeleteBookmarkUseCase(bookmarkRepo, topicRepo);
  const updateBookmarkUseCase = new UpdateBookmarkUseCase(bookmarkRepo, topicRepo, faviconDiscovery);
  const getBookmarksUseCase = new GetBookmarksUseCase(bookmarkRepo, topicRepo);
  const getThemeUseCase = new GetThemeUseCase(themeRepo);
  const setThemeUseCase = new SetThemeUseCase(themeRepo);

  // 5. Create Dependency Registry
  const registry = new DependencyRegistry({
    bookmarkRepository: bookmarkRepo,
    topicRepository: topicRepo,
    themeRepository: themeRepo,
    addBookmarkUseCase,
    deleteBookmarkUseCase,
    updateBookmarkUseCase,
    getBookmarksUseCase,
    getThemeUseCase,
    setThemeUseCase
  });

  // 6. Bootstrap UI
  await import('./presentation/app.js');
  const app = document.querySelector('bookmarks-app');
  if (app) {
    app.dependencies = registry;
  }
})();
