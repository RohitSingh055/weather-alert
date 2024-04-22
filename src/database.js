import { Client, Databases, ID } from "appwrite";

const appwriteClient = new Client();
  appwriteClient
    .setEndpoint("https://cloud.appwrite.io/v1") 
    .setProject(import.meta.env.VITE_PROJECT_ID);

export const databases = new Databases(appwriteClient);

export async function createDocument(data){
    try{
        return await databases.createDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_COLLECTION_ID, ID.unique(), data)
    }
    catch(error){
        console.log(error);
    }
} 