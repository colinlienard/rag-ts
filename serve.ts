import ollama from 'ollama';
import { config } from './config';
import { getCollection } from './utils';

type Body = {
  model: string;
  messages: { role: string; content: string }[];
};

const port = '11434';
console.log('Listening on port', port);

Bun.serve({
  port,
  routes: {
    '/api/chat': {
      async POST(req) {
        const body: Body = await req.json();
        const lastMessage = body.messages[body.messages.length - 1].content;

        const { embeddings } = await ollama.embed({
          model: 'mxbai-embed-large',
          input: lastMessage,
        });

        const collection = await getCollection();
        const result = await collection.query({ queryEmbeddings: embeddings, nResults: 10 });
        const documents = result.documents[0].filter(Boolean);

        body.messages[body.messages.length - 1].content = `${config.preprompt}
        Answer the following question based on the given context:
        Context: ${documents.join('\n')}
        Question: ${lastMessage}`;
        const output = await ollama.chat({ ...body, stream: true });

        return new Response(
          new ReadableStream({
            async start(controller) {
              for await (const chunk of output) {
                controller.enqueue(JSON.stringify(chunk) + '\n');
              }
              controller.close();
            },
          }),
          {
            headers: {
              'Content-Type': 'application/x-ndjson',
            },
          },
        );
      },
    },
  },
});
