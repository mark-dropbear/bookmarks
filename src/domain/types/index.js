/**
 * Data Transfer Object representing a plain Bookmark for use in the UI layer.
 * @typedef {Object} BookmarkDTO
 * @property {string} id - The unique identifier of the bookmark.
 * @property {string} name - The title of the bookmark.
 * @property {string} url - The absolute URL of the bookmark.
 * @property {string} description - A brief summary.
 * @property {string} image - A URL to an image/favicon.
 * @property {string[]} topicIds - Array of topic IDs this bookmark is associated with.
 * @property {string[]} [topicNames] - Optional array of topic names for display purposes.
 */

/**
 * Data Transfer Object representing a plain Topic for use in the UI layer.
 * @typedef {Object} TopicDTO
 * @property {string} id - The unique identifier of the topic.
 * @property {string} name - The name of the topic.
 * @property {string} description - A brief summary.
 * @property {string[]} bookmarkIds - Array of bookmark IDs associated with this topic.
 */

export {};