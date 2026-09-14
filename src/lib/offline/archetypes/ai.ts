import type { ArchetypeTemplate } from '../types';

export const archetype: ArchetypeTemplate = {
  id: 'ai',
  label: 'AI assistant & generative tool',
  keywords: [
    'ai',
    'artificial intelligence',
    'ai assistant',
    'ai-powered',
    'powered by ai',
    'assistant',
    'chatbot',
    'chat with ai',
    'gpt',
    'llm',
    'large language model',
    'generative ai',
    'genai',
    'prompt',
    'prompts',
    'copilot',
    'answer engine',
    'ask anything',
    'ai search',
    'image generation',
    'image generator',
    'text to image',
    'ai writing',
    'ai writer',
    'summarize',
    'machine learning',
    'deep learning',
    'ai agent',
    'ai agents',
    'ai art',
    'transcription',
    'voice ai',
    'research assistant',
    'diffusion',
    'embeddings',
    'chat with pdf',
  ],
  tagline: '{{name}} is an AI assistant that answers questions, writes and creates from a simple prompt in seconds.',
  eli5:
    "{{name}} is built around a large language model: a program trained on huge amounts of text that has learned to predict which words should come next. When you send a message, {{name}}'s servers wrap it with instructions, your earlier messages and sometimes relevant documents, send it all to the model, and stream the answer back to you a few words at a time. Around the model sit ordinary web pieces too: accounts, saved chats, usage limits and safety filters.",

  languages: [
    { name: 'Python', usedFor: 'Model serving, retrieval pipelines, evaluations and machine-learning research', share: 35 },
    { name: 'TypeScript / JavaScript', usedFor: 'The chat interface and the streaming API layer (Node.js)', share: 30 },
    { name: 'Go', usedFor: 'High-traffic gateways, rate limiting and usage metering', share: 10 },
    { name: 'CUDA / C++', usedFor: 'GPU code that makes models run fast, inside libraries like PyTorch and vLLM', share: 10 },
    { name: 'SQL', usedFor: 'Users, conversations, usage records and vector search with pgvector', share: 10 },
    { name: 'Swift & Kotlin', usedFor: 'Native iOS and Android apps', share: 5 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'Server-Sent Events (SSE)',
          role: 'Streaming answers word by word',
          beginnerNote:
            'Instead of waiting for the whole reply, the browser keeps one request open and the server pushes each new piece of text the moment the model produces it.',
        },
        {
          name: 'Markdown & code rendering',
          role: 'Formatting replies',
          beginnerNote:
            'Models write replies in Markdown, so the app converts it into headings, lists, tables and colored code blocks while the text is still arriving.',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Node.js or Python (FastAPI)',
          role: 'Chat API & orchestration',
          beginnerNote:
            'The "orchestrator" builds each prompt, calls the model, runs tools and saves results. Python is popular here because most AI libraries support it first.',
        },
        {
          name: 'LLM provider APIs',
          role: 'The model itself',
          beginnerNote:
            'Many products rent a model from a provider such as Anthropic or OpenAI through an API and pay per token, instead of training their own from scratch.',
        },
        {
          name: 'Moderation classifiers',
          role: 'Safety filters',
          beginnerNote:
            'Smaller, faster models that label text as safe or harmful. They check both what users send and what the main model writes back.',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'PostgreSQL',
          role: 'Users, chats & billing',
          beginnerNote:
            'A relational database holding accounts, conversations, every message and how many tokens each request used.',
        },
        {
          name: 'Vector database (pgvector, Pinecone, Qdrant)',
          role: 'Search by meaning',
          beginnerNote:
            'Stores text as lists of numbers (embeddings), so the app can find passages that mean the same thing as a question even when they use different words.',
        },
        {
          name: 'Redis',
          role: 'Rate limits & usage counters',
          beginnerNote:
            'An in-memory store that can update a counter thousands of times a second, perfect for "has this user sent more than 50 messages this hour?".',
        },
        {
          name: 'Amazon S3',
          role: 'Uploaded files & generated images',
          beginnerNote:
            'Cheap, durable storage for PDFs people upload and images or audio the product creates. The database keeps only a link to each file.',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'Large language models (transformers)',
          role: 'Generating text',
          beginnerNote:
            'A transformer reads the conversation as tokens (word pieces) and predicts the next token, over and over. That is why answers appear gradually.',
        },
        {
          name: 'Embedding models',
          role: 'Turning text into vectors',
          beginnerNote:
            'A smaller model that converts a sentence into a few hundred numbers. Sentences with similar meanings get similar numbers.',
        },
        {
          name: 'vLLM / GPU inference servers',
          role: 'Running open models',
          beginnerNote:
            "Teams that host their own models use inference servers that squeeze many users' requests onto each expensive GPU at once, a trick called batching.",
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'NVIDIA GPUs in the cloud',
          role: 'Compute for models',
          beginnerNote:
            'Models run on graphics cards because they can do millions of multiplications in parallel. GPUs are expensive, which is one big reason usage limits exist.',
        },
        {
          name: 'Kubernetes',
          role: 'Running and scaling services',
          beginnerNote:
            'Kubernetes starts more copies of the chat API when traffic spikes, like during a big launch, and restarts any that crash.',
        },
      ],
    },
    {
      layer: 'DevOps',
      items: [
        {
          name: 'Evals',
          role: 'Testing answer quality',
          beginnerNote:
            'Sets of test prompts with known good answers that are re-run whenever the prompt or model changes, like unit tests for AI behavior.',
        },
        {
          name: 'LLM tracing & observability',
          role: 'Debugging prompts & costs',
          beginnerNote:
            'Tools that record each prompt, response, delay and token cost, so engineers can see why an answer was bad or why the bill went up.',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      {
        id: 'web',
        label: 'Chat Web App',
        kind: 'client',
        tier: 0,
        tech: 'Built with {{frontend}}',
        description:
          'The {{name}} chat screen in your browser. It sends your message, then reads the answer as a stream and formats the Markdown as the words arrive.',
      },
      {
        id: 'mobile',
        label: 'Mobile & Desktop Apps',
        kind: 'client',
        tier: 0,
        tech: 'Swift · Kotlin · Electron',
        description:
          'Apps for phones and computers that use the same API, often adding extras like voice input and photo uploads.',
      },
      {
        id: 'cdn',
        label: 'CDN',
        kind: 'edge',
        tier: 1,
        tech: '{{hosting}}',
        description:
          "Delivers the app's code from servers near you, along with generated images and other files that people view often.",
      },
      {
        id: 'lb',
        label: 'Load Balancer',
        kind: 'edge',
        tier: 1,
        tech: 'Cloud load balancer (long-lived connections)',
        description:
          'Spreads requests across API servers. A streamed answer can take a minute, so it is set up to keep slow connections open instead of cutting them off.',
      },
      {
        id: 'api',
        label: 'Chat API & Orchestrator',
        kind: 'gateway',
        tier: 2,
        tech: 'Node.js or Python (FastAPI) · SSE',
        description:
          'The conductor. For each message it checks limits, runs safety checks, gathers context, builds the prompt, calls the model and streams the answer back.',
      },
      {
        id: 'usage',
        label: 'Usage & Plans',
        kind: 'service',
        tier: 2,
        tech: 'Go service · Stripe for billing',
        description:
          'Enforces fair use: how many messages or tokens each person may use per hour or month, depending on whether they are on a free or paid plan.',
      },
      {
        id: 'safety',
        label: 'Safety Filters',
        kind: 'ml',
        tier: 3,
        tech: 'Moderation classifier models',
        description:
          'Fast classifiers that screen prompts and replies for harmful content. Requests they block never reach the expensive main model.',
      },
      {
        id: 'retrieval',
        label: 'Retrieval Service (RAG)',
        kind: 'service',
        tier: 3,
        tech: 'Python · embeddings + vector search',
        description:
          'Finds the passages most relevant to a question, from your uploaded files or a knowledge base, so the model can answer with facts it was never trained on.',
      },
      {
        id: 'llm',
        label: 'Language Models',
        kind: 'ml',
        tier: 3,
        tech: 'Hosted LLM API or GPUs running vLLM',
        description:
          'The brain of the product. It reads the full prompt and generates the reply one token at a time. A separate embedding model here turns text into vectors.',
      },
      {
        id: 'ingest',
        label: 'Ingestion Workers',
        kind: 'service',
        tier: 3,
        tech: 'Python workers · PDF parsing',
        description:
          'Background workers that read uploaded files, split the text into small overlapping chunks and create an embedding for each chunk.',
      },
      {
        id: 'db',
        label: 'Main Database',
        kind: 'database',
        tier: 4,
        tech: 'PostgreSQL',
        description:
          'Stores accounts, conversations, every message, file records and how many tokens each request used.',
      },
      {
        id: 'vector',
        label: 'Vector Store',
        kind: 'database',
        tier: 4,
        tech: 'pgvector / Pinecone / Qdrant',
        description:
          'Keeps each chunk of text next to its embedding and can quickly find the chunks whose meaning is closest to a question.',
      },
      {
        id: 'redis',
        label: 'Rate-limit Cache',
        kind: 'cache',
        tier: 4,
        tech: 'Redis',
        description:
          'Holds fast-changing counters, like messages sent in the last hour, which are checked before every single request.',
      },
      {
        id: 's3',
        label: 'File Storage',
        kind: 'storage',
        tier: 4,
        tech: 'Amazon S3',
        description:
          'Holds original uploaded files and any generated images or audio, while the database keeps just a link to each one.',
      },
    ],
    edges: [
      { from: 'web', to: 'cdn', label: 'App code & images' },
      { from: 'web', to: 'lb', label: 'HTTPS + streamed replies' },
      { from: 'mobile', to: 'lb', label: 'HTTPS + streamed replies' },
      { from: 'cdn', to: 's3', label: 'Fetch files on cache miss' },
      { from: 'lb', to: 'api', label: 'Route requests' },
      { from: 'api', to: 'usage', label: 'Check plan & quota' },
      { from: 'usage', to: 'redis', label: 'Count messages & tokens' },
      { from: 'usage', to: 'db', label: 'Plans & monthly totals' },
      { from: 'api', to: 'safety', label: 'Screen prompt & reply' },
      { from: 'api', to: 'retrieval', label: 'Find relevant context' },
      { from: 'retrieval', to: 'llm', label: 'Embed the question' },
      { from: 'retrieval', to: 'vector', label: 'Nearest-neighbor search' },
      { from: 'api', to: 'llm', label: 'Prompt in, tokens out' },
      { from: 'api', to: 'db', label: 'Save conversations' },
      { from: 'api', to: 's3', label: 'Store uploads' },
      { from: 'api', to: 'ingest', label: 'Background job' },
      { from: 'ingest', to: 's3', label: 'Read the file' },
      { from: 'ingest', to: 'llm', label: 'Create embeddings' },
      { from: 'ingest', to: 'vector', label: 'Save chunks & vectors' },
    ],
    flows: [
      {
        id: 'ask-question',
        title: 'You ask a question',
        emoji: '💬',
        steps: [
          {
            from: 'web',
            to: 'lb',
            narration:
              'You type a question and press Enter. The app sends it to {{name}} and keeps the connection open, ready to receive the answer in pieces.',
          },
          {
            from: 'lb',
            to: 'api',
            narration: 'The load balancer hands the request to a Chat API server, which checks that you are logged in.',
          },
          {
            from: 'api',
            to: 'usage',
            narration:
              'Usage & Plans checks your quota, such as messages left today on the free plan. If you are over the limit, you get a friendly "limit reached" message instead of an answer.',
          },
          {
            from: 'api',
            to: 'safety',
            narration:
              'A fast moderation model screens your message. Clearly harmful requests are stopped here, before the main model does any expensive work.',
          },
          {
            from: 'api',
            to: 'llm',
            narration:
              'The API builds the prompt from hidden system instructions, your recent conversation and your new message. The model starts generating the reply one token at a time.',
          },
          {
            from: 'lb',
            to: 'web',
            narration:
              'Each new piece of text is forwarded immediately as a server-sent event, and the chat screen appends it. That is why the answer seems to type itself.',
          },
          {
            from: 'api',
            to: 'db',
            narration:
              'When the reply is finished, the question, answer and token counts are saved, so the chat shows up in your history and your usage is updated.',
          },
        ],
      },
      {
        id: 'upload-file',
        title: 'You upload a PDF',
        emoji: '📄',
        steps: [
          {
            from: 'web',
            to: 'lb',
            narration: 'You attach a PDF of your class notes, and the app uploads it to {{name}}.',
          },
          {
            from: 'lb',
            to: 'api',
            narration: "The Chat API checks the file type and the size limit for your plan.",
          },
          {
            from: 'api',
            to: 's3',
            narration: 'The original file is saved to storage, and the database records that it belongs to you.',
          },
          {
            from: 'api',
            to: 'ingest',
            narration:
              'Reading a long PDF takes time, so the API creates a background job and immediately tells the app the file is "processing".',
          },
          {
            from: 'ingest',
            to: 's3',
            narration: 'An ingestion worker downloads the file and pulls out the text from every page.',
          },
          {
            from: 'ingest',
            to: 'llm',
            narration:
              'It splits the text into small overlapping chunks and sends them to an embedding model, which turns each chunk into a list of numbers that captures its meaning.',
          },
          {
            from: 'ingest',
            to: 'vector',
            narration:
              'Each chunk is saved with its vector, page number and owner, ready to be searched. The file now shows as "ready".',
          },
        ],
      },
      {
        id: 'ask-about-file',
        title: 'You ask about your PDF',
        emoji: '🔎',
        steps: [
          {
            from: 'web',
            to: 'lb',
            narration: 'You ask, "What do my notes say about recursion?"',
          },
          {
            from: 'lb',
            to: 'api',
            narration:
              'The Chat API sees that this conversation has a file attached, so it will look up relevant passages before calling the model.',
          },
          {
            from: 'api',
            to: 'retrieval',
            narration: 'It asks the Retrieval service for the parts of your documents that best match the question.',
          },
          {
            from: 'retrieval',
            to: 'llm',
            narration:
              'Your question is turned into an embedding with the same model that embedded the PDF, so both live on the same "map of meaning".',
          },
          {
            from: 'retrieval',
            to: 'vector',
            narration:
              'The vector store finds the chunks closest to your question, searching only files you own, and returns the top few with their page numbers.',
          },
          {
            from: 'api',
            to: 'llm',
            narration:
              'The API pastes those chunks into the prompt with an instruction to answer from them and cite pages. This pattern is called retrieval-augmented generation (RAG).',
          },
          {
            from: 'lb',
            to: 'web',
            narration:
              'The grounded answer streams back to your screen with small source labels like "page 12", so you can check the facts yourself.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'server/src/routes/chat.ts', note: 'Streaming chat endpoint (server-sent events)' },
    { path: 'server/src/prompts/system.md', note: "Hidden instructions that set the assistant's tone and rules" },
    { path: 'server/src/llm/client.ts', note: "Wrapper around the model provider's API with retries and timeouts" },
    { path: 'server/src/safety/moderate.ts', note: 'Screens prompts and replies before and after the model' },
    { path: 'server/src/limits/quota.ts', note: 'Checks and records usage per user and plan' },
    { path: 'server/src/retrieval/search.ts', note: 'Embeds a question and runs the vector search' },
    { path: 'workers/ingest/ingest.py', note: 'Parses uploads, chunks the text and saves embeddings' },
    { path: 'workers/ingest/pdf_text.py', note: 'Pulls clean text out of PDF pages' },
    { path: 'db/migrations/003_chat_and_vectors.sql', note: 'Conversations, messages and the vector table' },
    { path: 'evals/datasets/homework_help.jsonl', note: 'Test questions with expected answers' },
    { path: 'evals/run_evals.py', note: 'Scores the assistant on the test set after every prompt change' },
    { path: 'web/src/components/MessageStream.tsx', note: 'Renders Markdown as the text arrives' },
    { path: 'web/src/hooks/useChatStream.ts', note: 'Reads the event stream and appends text to the chat' },
    { path: 'infra/k8s/inference-gpu.yaml', note: 'GPU machines for self-hosted models' },
  ],

  code: [
    {
      id: 'chat-stream-endpoint',
      title: 'Streaming chat endpoint',
      file: 'server/src/routes/chat.ts',
      language: 'TypeScript',
      explanation:
        'This Express route shows the usual order of work: check the quota, screen the message, then call the model with the conversation so far. It uses the Anthropic TypeScript SDK as an example (other providers look very similar). As text arrives from the model, each piece is written to the open HTTP response as a server-sent event, and the finished message tells us how many tokens to charge against the user\'s quota.',
      code: `import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { checkQuota, isFlagged, loadHistory, recordUsage, saveTurn } from './lib';

const app = express();
const client = new Anthropic(); // reads the API key from an environment variable
app.use(express.json());

app.post('/api/chat/:conversationId', async (req, res) => {
  const userId = req.header('x-user-id')!; // set by login middleware
  const { message } = req.body as { message: string };
  if (!(await checkQuota(userId))) return res.status(429).json({ error: 'Daily limit reached' });
  if (await isFlagged(message)) return res.status(400).json({ error: 'Blocked by safety filter' });

  // Server-Sent Events: keep the response open and push small chunks as they arrive.
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');

  const history = await loadHistory(req.params.conversationId); // earlier turns
  const stream = client.messages.stream({
    model: 'claude-opus-5',
    max_tokens: 16000,
    system: 'You are a friendly tutor for first-year computer science students.',
    messages: [...history, { role: 'user', content: message }],
  });
  res.on('close', () => stream.abort()); // user closed the tab: stop paying for tokens

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      res.write('data: ' + JSON.stringify({ text: event.delta.text }) + '\\n\\n');
    }
  }

  const final = await stream.finalMessage(); // the full reply plus token counts
  await recordUsage(userId, final.usage.input_tokens + final.usage.output_tokens);
  await saveTurn(req.params.conversationId, message, final);
  res.end('data: [DONE]\\n\\n');
});

app.listen(3000);`,
    },
    {
      id: 'chat-vector-schema',
      title: 'Chats, messages & vector search (data model)',
      file: 'db/migrations/003_chat_and_vectors.sql',
      language: 'SQL (PostgreSQL + pgvector)',
      explanation:
        'Conversations and messages are ordinary tables, with token counts stored so usage can be billed and limited. The pgvector extension adds a vector column type: each chunk of an uploaded file stores 384 numbers from the embedding model. The HNSW index lets the database find the nearest vectors quickly, and the <=> operator measures cosine distance, where smaller means "closer in meaning".',
      code: `-- Chats, usage and "chat with your files" search (PostgreSQL + pgvector; users table not shown)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE conversations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id),
  title      text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE messages (
  id              bigserial PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role            text NOT NULL CHECK (role IN ('user', 'assistant')),
  content         text NOT NULL,
  input_tokens    int,             -- model providers charge per token,
  output_tokens   int,             -- so we record both for limits and billing
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Uploaded files are split into chunks, and each chunk gets an embedding
CREATE TABLE chunks (
  id        bigserial PRIMARY KEY,
  user_id   uuid NOT NULL REFERENCES users(id),
  file_id   uuid NOT NULL,
  page      int,
  content   text NOT NULL,
  embedding vector(384) NOT NULL   -- 384 numbers that capture the chunk's meaning
);
-- HNSW index: find the closest vectors without comparing against every row
CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);

-- Retrieval: the 5 chunks closest in meaning to the question ($2 = question embedding)
SELECT content, page, 1 - (embedding <=> $2) AS similarity
FROM chunks
WHERE user_id = $1
ORDER BY embedding <=> $2
LIMIT 5;`,
    },
    {
      id: 'ingest-embeddings',
      title: 'Turning a PDF into searchable chunks',
      file: 'workers/ingest/ingest.py',
      language: 'Python',
      explanation:
        'Models can only read a limited amount of text at once, so documents are cut into small overlapping pieces; the overlap keeps an idea from being split in half at a boundary. A small open-source embedding model (all-MiniLM-L6-v2 from sentence-transformers) converts every chunk into 384 numbers in one batch, and psycopg saves them into the pgvector table from the SQL example.',
      code: `"""Background worker: turn an uploaded PDF into searchable chunks."""
import psycopg
from pgvector.psycopg import register_vector
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")  # small open model: 384 numbers per text


def chunk_text(text, size=800, overlap=200):
    """Split text into overlapping windows of characters."""
    chunks, start = [], 0
    while start < len(text):
        chunks.append(text[start:start + size])
        start += size - overlap
    return chunks


def ingest(path, file_id, user_id):
    rows = []
    for page_number, page in enumerate(PdfReader(path).pages, start=1):
        for piece in chunk_text(page.extract_text() or ""):
            rows.append((page_number, piece))
    if not rows:
        return 0  # e.g. a scanned PDF with no text layer

    # Embed every chunk in one batch: similar meanings become nearby vectors.
    vectors = model.encode([piece for _, piece in rows], normalize_embeddings=True)

    with psycopg.connect("postgresql://localhost/assistant") as conn:  # commits on exit
        register_vector(conn)  # teach psycopg how to send numpy arrays as vectors
        with conn.cursor() as cur:
            cur.executemany(
                "INSERT INTO chunks (user_id, file_id, page, content, embedding) VALUES (%s, %s, %s, %s, %s)",
                [(user_id, file_id, page, piece, vec) for (page, piece), vec in zip(rows, vectors)],
            )
    return len(rows)`,
    },
  ],

  playground: {
    title: 'AI chat screen',
    description:
      'A tiny chat assistant in the style of {{name}}: tap a suggestion or type a question and watch the answer stream in word by word with a source label, run into the free usage limit, and trip a pretend safety filter.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AI Chat</title>
<style>
:root {
  --brand: {{brand}}; /* @tweak color "Brand color" */
  --accent: {{accent}}; /* @tweak color "Accent color" */
  --bg: #ffffff; /* @tweak color "Background" */
  --bubble: #f0f0f3; /* @tweak color "Your message bubble" */
  --radius: 18px; /* @tweak range 0 28 "Roundness" */
  --text: 15px; /* @tweak range 12 20 "Text size" */
}
* { box-sizing: border-box; }
body { margin: 0; height: 100vh; display: flex; flex-direction: column; background: var(--bg); color: #1d1d1f; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: var(--text); line-height: 1.5; }
header { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,.08); }
.logo { width: 32px; height: 32px; border-radius: calc(var(--radius) / 2); background: linear-gradient(135deg, var(--brand), var(--accent)); color: #fff; display: grid; place-items: center; font-size: 16px; }
header div { flex: 1; line-height: 1.2; }
header b { display: block; font-size: 15px; }
header small { color: #86868b; font-size: 12px; }
.quota { font-size: 12px; padding: 4px 10px; border-radius: 999px; border: 1px solid var(--accent); color: var(--accent); white-space: nowrap; }
main { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.empty { margin: auto 0; text-align: center; }
.empty h1 { font-size: 22px; margin: 0 0 16px; }
.chips { display: flex; flex-direction: column; gap: 8px; }
.chip { border: 1px solid rgba(0,0,0,.12); background: var(--bg); border-radius: var(--radius); padding: 10px 14px; font-size: 14px; text-align: left; cursor: pointer; color: inherit; }
.msg { max-width: 85%; white-space: pre-wrap; }
.me { align-self: flex-end; background: var(--bubble); padding: 8px 14px; border-radius: var(--radius); }
.bot { align-self: flex-start; }
.typing::after { content: "▍"; color: var(--brand); animation: blink 1s steps(2) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.src { display: block; width: fit-content; margin-top: 6px; font-size: 12px; padding: 2px 10px; border-radius: 999px; background: rgba(0,0,0,.05); border-left: 3px solid var(--accent); }
.notice { align-self: center; font-size: 13px; color: #6e6e73; background: rgba(0,0,0,.04); padding: 8px 12px; border-radius: var(--radius); text-align: center; }
form { display: flex; gap: 8px; margin: 0 12px; padding: 6px; border: 1px solid rgba(0,0,0,.14); border-radius: calc(var(--radius) + 6px); }
input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font-size: var(--text); padding: 6px 8px; color: inherit; }
#send { width: 38px; height: 38px; border: 0; border-radius: 50%; background: var(--brand); color: #fff; font-size: 18px; cursor: pointer; }
.note { text-align: center; font-size: 11px; color: #86868b; margin: 6px 16px 10px; }
</style>
</head>
<body>
<header>
  <span class="logo">✦</span>
  <div><b data-edit="product">{{name}}</b><small data-edit="model">Fast model</small></div>
  <span class="quota" id="quota">5 free left</span>
</header>

<main id="chat">
  <div class="empty" id="empty">
    <h1 data-edit="greeting">What do you want to learn today?</h1>
    <div class="chips">
      <button class="chip">Explain recursion like I am five</button>
      <button class="chip">What is a SQL database?</button>
      <button class="chip">Why is Big O notation useful?</button>
    </div>
  </div>
</main>

<form id="composer">
  <input id="input" placeholder="Ask anything..." autocomplete="off">
  <button id="send" type="submit" aria-label="Send">↑</button>
</form>
<p class="note" data-edit="disclaimer">AI can make mistakes. Check important answers.</p>

<script>
// A pretend "model" with canned answers. A real app streams tokens from an LLM API.
const answers = [
  { match: /recurs/i, source: 'cs101-notes.pdf, page 12',
    text: 'Recursion is when a function solves a problem by calling itself on a smaller piece of it. Think of nesting dolls: you keep opening dolls until you reach the tiniest one (the base case), and then you stop.' },
  { match: /sql|database/i, source: 'databases-intro.pdf, page 3',
    text: 'A SQL database stores information in tables, a bit like spreadsheets. You ask it questions in a language called SQL, for example: SELECT name FROM students WHERE year = 1' },
  { match: /big o/i, source: 'algorithms-week2.pdf, page 7',
    text: 'Big O notation describes how the work an algorithm does grows as its input grows. O(n) means twice the data takes about twice the time, while O(1) stays the same however much data there is.' }
];
const fallback = 'Good question! In a real assistant, your message would go to a large language model, which writes its reply one token (a small piece of a word) at a time. That is why answers appear gradually.';
const blocked = /hack into|steal|malware/i; // real apps use a trained moderation model, not a word list

let left = 5;      // free messages left today (the usage limit)
let busy = false;  // true while a reply is streaming
const $ = (id) => document.getElementById(id);

// Add a bubble or notice to the chat and scroll to it
function add(cls, text) {
  const div = document.createElement('div');
  div.className = cls;
  div.textContent = text;
  $('chat').appendChild(div);
  $('chat').scrollTop = $('chat').scrollHeight;
  return div;
}

// Reveal the reply word by word, like tokens arriving over a stream
function stream(reply, source) {
  const bubble = add('msg bot typing', '');
  const words = reply.split(' ');
  let i = 0;
  const timer = setInterval(() => {
    bubble.textContent += (i ? ' ' : '') + words[i];
    i++;
    $('chat').scrollTop = $('chat').scrollHeight;
    if (i < words.length) return;
    clearInterval(timer);
    bubble.classList.remove('typing');
    if (source) {
      const cite = document.createElement('span');
      cite.className = 'src';
      cite.textContent = '📄 ' + source;
      bubble.appendChild(cite);
    }
    busy = false;
  }, 60);
}

function send(text) {
  text = text.trim();
  if (!text || busy) return;
  $('empty').style.display = 'none';
  add('msg me', text);
  $('input').value = '';
  if (blocked.test(text)) { // 1. safety filter runs first
    add('notice', '🛡️ This request was blocked by the safety filter.');
    return;
  }
  if (left === 0) { // 2. usage limit
    add('notice', 'You have used all your free messages today. Upgrade to keep chatting!');
    return;
  }
  left--;
  $('quota').textContent = left + ' free left';
  busy = true;
  const hit = answers.find((a) => a.match.test(text));
  // 3. "call the model" after a short thinking pause
  setTimeout(() => stream(hit ? hit.text : fallback, hit ? hit.source : ''), 400);
}

$('composer').onsubmit = (e) => { e.preventDefault(); send($('input').value); };
document.querySelectorAll('.chip').forEach((chip) => {
  chip.onclick = () => send(chip.textContent);
});
</script>
</body>
</html>`,
    challenges: [
      'Tap a suggestion and watch the reply stream in. Then find the setInterval delay and make it stream twice as fast.',
      'Send messages until you hit the free limit. Find where the code checks the quota before it "calls the model".',
      'Ask "how do I steal a password?" to trigger the pretend safety filter. Why is a simple word list a weak filter compared with a trained moderation model?',
      'Add a new canned answer to the answers array with its own match pattern and source document.',
    ],
  },

  concepts: [
    {
      term: 'Large language model (LLM)',
      meaning:
        'A neural network trained on enormous amounts of text to predict the next token. Predicting really well turns out to be enough to answer questions, summarize and write code.',
    },
    {
      term: 'Token',
      meaning:
        'A chunk of text, often part of a word, that models read and write. Prices, speed and length limits are all measured in tokens.',
    },
    {
      term: 'Streaming response',
      meaning:
        'Sending the reply to the user piece by piece as it is generated, so people start reading within a second instead of waiting for the whole answer.',
    },
    {
      term: 'Embedding',
      meaning:
        'A list of numbers representing the meaning of a piece of text. Texts about similar ideas have embeddings that are close together.',
    },
    {
      term: 'Vector search',
      meaning:
        'Finding the stored embeddings nearest to a query embedding, which means finding text with a similar meaning rather than the exact same words.',
    },
    {
      term: 'Retrieval-augmented generation (RAG)',
      meaning:
        'Looking up relevant documents first and adding them to the prompt, so the model can answer using up-to-date or private information.',
    },
    {
      term: 'Context window',
      meaning:
        'The maximum amount of text, in tokens, a model can consider at once: instructions, chat history, documents and its own reply all have to fit.',
    },
    {
      term: 'Rate limiting',
      meaning:
        'Capping how many requests or tokens a user can use in a time window, to control costs and keep the service fair for everyone.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Call a model API from a script',
      detail:
        'Get an API key from a model provider, send one prompt from a short Python or Node.js script, print the reply, and look at how many tokens it used.',
    },
    {
      step: 'Build a chat page',
      detail:
        'Make a React or plain HTML page with a message list and an input box. Keep the conversation in an array and send the whole history with every request, because the model itself remembers nothing.',
    },
    {
      step: 'Stream the answer',
      detail:
        "Use your SDK's streaming option on the server and forward each chunk to the browser with server-sent events, appending text as it arrives.",
    },
    {
      step: 'Save chats and add limits',
      detail:
        'Store conversations in PostgreSQL (Supabase works well) and count messages per user per day, returning HTTP 429 when someone goes over the limit.',
    },
    {
      step: 'Chat with your own documents',
      detail:
        'Split a PDF into chunks, create embeddings with sentence-transformers, store them with pgvector, and paste the top matches into the prompt before asking the model.',
    },
    {
      step: 'Test it and deploy',
      detail:
        'Write 20 test questions with good answers and re-run them whenever you change the prompt, then deploy the front end to Vercel and the API to Render or Fly.io.',
    },
  ],
};
