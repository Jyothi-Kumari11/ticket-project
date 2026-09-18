// database/database.js
// Re-exports MongoDB as the primary database interface
export { getMongoDb as getDb } from './mongodb.js';

/**
 * A simple MongoDB query helper that mimics the old SQL `query()` interface
 * but is NOT used for MongoDB routes. Routes now use getMongoDb() directly.
 * This file is kept for backward compatibility but should not be used directly.
 */
