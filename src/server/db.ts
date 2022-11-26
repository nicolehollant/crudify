import { MongoClient } from "mongodb";
import { User } from "~types/app";

const dbUri = process.env.DB_URI ?? "";
export const mongoClient = new MongoClient(dbUri);
let connection: MongoClient | null = null;

export const connectToCollection = async (collectionName = "baas") => {
  if (!connection) {
    connection = await mongoClient.connect();
  }
  const db = connection.db();
  const collection = db.collection(collectionName);
  return { collection, connection };
};

export const Users = async () => {
  const { collection, connection } = await connectToCollection("baas");
  return { collection, connection };
};
export const Accounts = async () => {
  const { collection, connection } = await connectToCollection("users");
  return { collection, connection };
};
