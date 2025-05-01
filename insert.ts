import ollama from 'ollama';
import { getOrCreateCollection } from './utils';

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

const response = await fetch('https://svelte.dev/llms-full.txt');
let raw = await response.text();

console.log('INFO: Fetched ' + raw.length + ' characters');

const chunks: string[] = [];
while (raw.length > CHUNK_SIZE) {
  chunks.push(raw.slice(0, CHUNK_SIZE));
  raw = raw.slice(CHUNK_SIZE - CHUNK_OVERLAP);
}

console.log('INFO: Chunked ' + chunks.length + ' chunks');

const collection = await getOrCreateCollection();

process.stdout.write('INFO: Added chunk 0');
for (const [index, chunk] of chunks.entries()) {
  const { embeddings } = await ollama.embed({ model: 'mxbai-embed-large', input: chunk });
  await collection.add({ ids: [index + ''], embeddings, documents: [chunk] });
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write('INFO: Added chunk ' + index);
}
