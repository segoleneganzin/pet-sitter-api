// import { MongoClient, Db } from 'mongodb';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectionString: string = process.env.ATLAS_URI || '';
// const client = new MongoClient(connectionString);
// let dbInstance: Db;

export const dbConnection = async () => {
  try {
    await mongoose.connect(connectionString, {
      dbName: 'pet-sitter-db',
    });
  } catch (error) {
    console.error(`Database Connectivity Error: ${error}`);
    throw new Error(String(error));
  }
};
