import { ChromaClient } from 'chromadb';
import { config } from './config';

const chroma = new ChromaClient({ path: 'http://localhost:8000' });

export async function getOrCreateCollection() {
  const collections = await chroma.listCollections();
  if (collections.find((c) => c === config.collectionName)) {
    await chroma.deleteCollection({ name: config.collectionName });
    console.log('Deleted previous collection');
  }
  return await chroma.getOrCreateCollection({ name: config.collectionName });
}

export async function getCollection() {
  return await chroma.getCollection({ name: config.collectionName });
}
