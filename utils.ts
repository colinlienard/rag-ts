import { ChromaClient } from 'chromadb';

const collectionName = 'svelte';

const chroma = new ChromaClient({ path: 'http://localhost:8000' });

export async function getOrCreateCollection() {
  const collections = await chroma.listCollections();
  if (collections.find((c) => c === collectionName)) {
    await chroma.deleteCollection({ name: collectionName });
    console.log('Deleted previous collection');
  }
  return await chroma.getOrCreateCollection({ name: collectionName });
}

export async function getCollection() {
  return await chroma.getCollection({ name: collectionName });
}
