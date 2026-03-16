import { Task } from '@lit/task';
import { ContextConsumer } from '@lit/context';
import { getBookmarksContext } from '../context.js';

/**
 * A Reactive Controller that manages the state and logic for fetching bookmarks.
 * It integrates with @lit/context to retrieve the GetBookmarksUseCase and
 * uses @lit/task to handle the asynchronous lifecycle.
 */
export class BookmarksController {
  #task;
  #useCaseConsumer;

  /**
   * @param {import('lit').ReactiveElement & { searchQuery?: string }} host - The component using this controller.
   */
  constructor(host) {
    this.host = host;
    host.addController(this);

    // Initialize the context consumer to get the use case.
    // We use a callback to ensure the host re-renders (and thus the task re-evaluates args)
    // when the context value is found or changed.
    this.#useCaseConsumer = new ContextConsumer(host, {
      context: getBookmarksContext,
      subscribe: true,
      callback: (value) => {
        if (value) {
          this.host.requestUpdate();
        }
      }
    });

    // Initialize the task.
    this.#task = new Task(host, {
      task: async ([useCase, query]) => {
        if (!useCase) {
          // If the use case isn't available yet, return an empty array.
          // The callback above will trigger a host update once the use case is available,
          // which will trigger this task to run again with the use case.
          return [];
        }
        return await useCase.execute(query);
      },
      args: () => [this.#useCaseConsumer.value, host.searchQuery ?? '']
    });
  }

  /**
   * Returns the current value of the task.
   * @returns {any[] | undefined}
   */
  value() {
    return this.#task.value;
  }

  /**
   * Returns the current status of the task.
   * @returns {import('@lit/task').TaskStatus}
   */
  status() {
    return this.#task.status;
  }

  /**
   * Renders the task state using the provided renderer.
   * @param {import('@lit/task').TaskRenderer<any[]>} renderer 
   */
  render(renderer) {
    return this.#task.render(renderer);
  }

  /**
   * Manually triggers a task refresh.
   */
  refresh() {
    this.#task.run();
  }
}
