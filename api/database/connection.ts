import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const connectionString: string = process.env.ATLAS_URI || '';
const client = new MongoClient(connectionString);
let dbInstance: Db;

export const dbConnection = async (): Promise<Db> => {
  if (!dbInstance) {
    try {
      await client.connect();
      dbInstance = client.db('pet-sitter-app');
      console.log('Database successfully connected');
    } catch (error) {
      console.error(`Database Connectivity Error: ${error}`);
      throw new Error(String(error));
    }
  }
  return dbInstance;
};

export { dbInstance };
