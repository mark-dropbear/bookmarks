/**
 * @typedef {Object} TopicReference
 * @property {string} @id - The unique identifier of the topic.
 * @property {string} [name] - The name of the topic.
 */

/**
 * Data structure representing the persistence/JSON-LD state of a Bookmark.
 * @typedef {Object} BookmarkData
 * @property {string} [id] - The unique identifier for the webpage (fallback for @id).
 * @property {string} [@id] - The canonical JSON-LD unique identifier.
 * @property {string} name - The title of the webpage.
 * @property {string} [description] - A brief summary of the webpage.
 * @property {string} url - The absolute URL of the webpage.
 * @property {string} [image] - A URL to an image representing the webpage (e.g., a favicon).
 * @property {TopicReference[]} [about] - Topics this webpage is about.
 */

/**
 * @typedef {Object} BookmarkReference
 * @property {string} @id - The unique identifier of the bookmark.
 */

/**
 * Data structure representing the persistence/JSON-LD state of a Topic.
 * @typedef {Object} TopicData
 * @property {string} [id] - The unique identifier for the topic (fallback for @id).
 * @property {string} [@id] - The canonical JSON-LD unique identifier.
 * @property {string} name - The name of the topic.
 * @property {string} [description] - A brief summary of the topic.
 * @property {BookmarkReference[]} [subjectOf] - Webpages that are about this topic.
 */

export {};
