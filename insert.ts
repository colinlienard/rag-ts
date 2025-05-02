import ollama from 'ollama';
import { MDocument } from '@mastra/rag';
import { getOrCreateCollection } from './utils';

const response = await fetch('https://svelte.dev/docs/svelte/llms.txt');
let raw = await response.text();

console.log('Fetched ' + raw.length + ' characters');

const chunks = await chunkByMarkdownContext(raw);

console.log('Split into ' + chunks.length + ' chunks');

const collection = await getOrCreateCollection();

for (const [index, chunk] of chunks.entries()) {
  const { embeddings } = await ollama.embed({ model: 'mxbai-embed-large', input: chunk });
  await collection.add({ ids: [index + ''], embeddings, documents: [chunk] });
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write('Inserted chunk ' + index);
}

console.log('\nSuccess!');

function chunkByFixedSize(raw: string, size = 1028, overlap = 200) {
  const chunks: string[] = [];
  while (raw.length > size) {
    chunks.push(raw.slice(0, size));
    raw = raw.slice(size - overlap);
  }
  return chunks;
}

async function chunkByMarkdownContext(raw: string) {
  raw = raw.replace(/(\+\+\+)/g, '');
  raw = raw.replace(/---[\s\S]*?---/g, '');
  raw = raw.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  const doc = MDocument.fromText(raw);
  const result = await doc.chunk({ strategy: 'markdown', size: 1028, overlap: 200 });
  return result.map((item) => item.text);
}
