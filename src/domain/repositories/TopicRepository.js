/**
 * Interface for topic storage and retrieval operations.
 * @interface TopicRepository
 */
export class TopicRepository {
  /**
   * Adds or updates a topic in the repository.
   * @param {import('../entities/Topic.js').Topic} topic - The topic to save.
   * @returns {Promise<void>}
   */
  async add(_topic) {
    throw new Error('Not implemented');
  }

  /**
   * Retrieves all topics.
   * @returns {Promise<import('../entities/Topic.js').Topic[]>}
   */
  async getAll() {
    throw new Error('Not implemented');
  }

  /**
   * Finds a topic by its unique identifier.
   * @param {string} id - The @id of the topic.
   * @returns {Promise<import('../entities/Topic.js').Topic|null>}
   */
  async getById(_id) {
    throw new Error('Not implemented');
  }

  /**
   * Finds a topic by its name.
   * @param {string} name - The name of the topic.
   * @returns {Promise<import('../entities/Topic.js').Topic|null>}
   */
  async getByName(_name) {
    throw new Error('Not implemented');
  }

  /**
   * Deletes a topic by its unique identifier.
   * @param {string} id - The @id of the topic.
   * @returns {Promise<void>}
   */
  async delete(_id) {
    throw new Error('Not implemented');
  }
}
