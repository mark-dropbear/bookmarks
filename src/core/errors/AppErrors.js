/**
 * Base class for all application-specific errors.
 * Provides a consistent structure for error reporting and identification.
 */
export class AppError extends Error {
  /**
   * @param {string} message - A human-readable error message.
   * @param {Object} [options] - Additional error details.
   * @param {string} [options.code] - A machine-readable error code.
   * @param {any} [options.details] - Arbitrary context about the error.
   */
  constructor(message, { code = 'APP_ERROR', details = null } = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    
    // Captures the stack trace correctly (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Thrown when a business rule or domain logic is violated.
 */
export class DomainError extends AppError {
  constructor(message, options = {}) {
    super(message, { code: 'DOMAIN_ERROR', ...options });
  }
}

/**
 * Thrown when input data fails validation rules.
 */
export class ValidationError extends DomainError {
  constructor(message, options = {}) {
    super(message, { code: 'VALIDATION_ERROR', ...options });
  }
}

/**
 * Thrown when a resource (e.g., a Bookmark or Topic) already exists.
 */
export class ConflictError extends DomainError {
  constructor(message, options = {}) {
    super(message, { code: 'CONFLICT_ERROR', ...options });
  }
}

/**
 * Thrown when an infrastructure or external dependency fails (e.g., database, network).
 */
export class InfrastructureError extends AppError {
  constructor(message, options = {}) {
    super(message, { code: 'INFRASTRUCTURE_ERROR', ...options });
  }
}

/**
 * Thrown when a data storage or retrieval operation fails.
 */
export class RepositoryError extends InfrastructureError {
  constructor(message, options = {}) {
    super(message, { code: 'REPOSITORY_ERROR', ...options });
  }
}

/**
 * Thrown when a requested resource is not found.
 */
export class NotFoundError extends InfrastructureError {
  constructor(message, options = {}) {
    super(message, { code: 'NOT_FOUND_ERROR', ...options });
  }
}
