import ollama from 'ollama';
import { getCollection } from './utils';

const input = process.argv[2];

const { embeddings } = await ollama.embed({ model: 'mxbai-embed-large', input });

const collection = await getCollection();
const result = await collection.query({ queryEmbeddings: embeddings, nResults: 10 });
const documents = result.documents[0].filter(Boolean);
for (const [index, doc] of documents.entries()) {
  console.log('\x1b[96m' + doc + '\x1b[0m');
  if (index !== documents.length - 1) {
    console.log('\nNext chunk\n');
  }
}

console.log('\nGenerating response...\n');

const prompt = `Always use the Svelte 5 and runes syntax. Try to avoid using Svelte stores.
Answer the following question based on the given context:
Context: ${documents.join('\n')}
Question: ${input}`;
const output = await ollama.generate({ model: 'mistral', prompt, stream: true });
for await (const part of output) {
  process.stdout.write(part.response);
}
