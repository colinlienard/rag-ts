# RAG in Typescript

## Setup

Start the ChromaDB server:

```bash
docker run -p 8000:8000 -v chroma-data:/chromadb/data chromadb/chroma
```

Pull the Ollama embedding model:

```bash
ollama pull mxbai-embed-large
```

## Usage

Insert data into Chroma:

```bash
bun insert.ts
```

Use the RAG:

```bash
bun retrieve.ts "Create a svelte counter component using the $state rune"
```

TODO: Mock the Ollama server:

```bash
bun serve.ts
```
