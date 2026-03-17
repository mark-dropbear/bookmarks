import { DependencyRegistry } from './core/DependencyRegistry.js';
import { InMemoryBookmarkRepository } from './data/repositories/InMemoryBookmarkRepository.js';
import { InMemoryTopicRepository } from './data/repositories/InMemoryTopicRepository.js';
import { BrowserThemeRepository } from './data/repositories/BrowserThemeRepository.js';
import { BrowserImageValidationService } from './data/services/BrowserImageValidationService.js';
import { FaviconDiscovery } from './domain/usecases/FaviconDiscovery.js';
import { AddBookmarkUseCase } from './domain/usecases/AddBookmarkUseCase.js';
import { DeleteBookmarkUseCase } from './domain/usecases/DeleteBookmarkUseCase.js';
import { UpdateBookmarkUseCase } from './domain/usecases/UpdateBookmarkUseCase.js';
import { GetBookmarksUseCase } from './domain/usecases/GetBookmarksUseCase.js';
import { GetThemeUseCase } from './domain/usecases/GetThemeUseCase.js';
import { SetThemeUseCase } from './domain/usecases/SetThemeUseCase.js';

// 1. Initialize Infrastructure
const bookmarkRepo = new InMemoryBookmarkRepository();
const topicRepo = new InMemoryTopicRepository();
const themeRepo = new BrowserThemeRepository();
const imageValidationService = new BrowserImageValidationService();

// 2. Initialize Domain Services
const faviconDiscovery = new FaviconDiscovery(imageValidationService);

// 3. Initialize Use Cases
const addBookmarkUseCase = new AddBookmarkUseCase(bookmarkRepo, topicRepo, faviconDiscovery);
const deleteBookmarkUseCase = new DeleteBookmarkUseCase(bookmarkRepo, topicRepo);
const updateBookmarkUseCase = new UpdateBookmarkUseCase(bookmarkRepo, topicRepo, faviconDiscovery);
const getBookmarksUseCase = new GetBookmarksUseCase(bookmarkRepo, topicRepo);
const getThemeUseCase = new GetThemeUseCase(themeRepo);
const setThemeUseCase = new SetThemeUseCase(themeRepo);

// 4. Create Dependency Registry
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

// 5. Bootstrap UI
import './presentation/app.js';
const app = document.querySelector('bookmarks-app');
if (app) {
  app.dependencies = registry;
}
