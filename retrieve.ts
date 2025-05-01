import ollama from 'ollama';
import { getCollection } from './utils';

const input = 'Create a svelte counter component using runes';

const { embeddings } = await ollama.embed({ model: 'mxbai-embed-large', input });

const collection = await getCollection();
const results = await collection.query({ queryEmbeddings: embeddings, nResults: 10 });

const prompt =
  input +
  '\n Answer that question using the following text as a resource:\n' +
  results.documents.join('\n');
const output = await ollama.generate({ model: 'codestral', prompt, stream: true });
for await (const part of output) {
  process.stdout.write(part.response);
}
