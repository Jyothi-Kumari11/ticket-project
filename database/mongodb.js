import 'dotenv/config';
import { MongoClient } from 'mongodb';

let client = null;
let database = null;
let connectionError = null;

export async function connectMongoDB() {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    connectionError = new Error('MONGODB_URI is not set in environment variables');
    return null;
  }

  if (!/^mongodb(\+srv)?:\/\//.test(uri)) {
    connectionError = new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://');
    throw connectionError;
  }

  try {
    if (database) {
      return database;
    }

    client = new MongoClient(uri);
    await client.connect();
    database = client.db(process.env.MONGODB_DB_NAME || 'ticket-management');
    await database.command({ ping: 1 });
    connectionError = null;
    console.log('MongoDB connected successfully to database:', process.env.MONGODB_DB_NAME || 'ticket-management');

    return database;
  } catch (err) {
    connectionError = err;
    client = null;
    database = null;
    throw err;
  }
}

export async function getMongoDb() {
  if (!database) {
    await connectMongoDB();
  }

  return database;
}

export function getMongoStatus() {
  if (!process.env.MONGODB_URI?.trim()) {
    return { configured: false, connected: false };
  }

  return {
    configured: true,
    connected: Boolean(database),
    error: connectionError?.message || null
  };
}

export async function closeMongoDB() {
  if (client) {
    await client.close();
    client = null;
    database = null;
  }
}
