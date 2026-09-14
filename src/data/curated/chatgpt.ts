import type { Teardown } from '../types';

export const chatgpt: Teardown = {
  id: 'chatgpt',
  name: 'ChatGPT',
  url: 'chatgpt.com',
  tagline: 'Chat with an AI assistant that writes, explains, codes and answers questions.',
  category: 'AI Assistant',
  brandColor: '#10A37F',
  accentColor: '#202123',
  logoGlyph: '🤖',
  source: 'curated',

  eli5:
    "ChatGPT is like an incredibly well-read autocomplete. When you send a message, OpenAI's servers turn your whole conversation into small chunks of text called tokens and feed them to a huge AI model running on powerful graphics chips (GPUs), which predicts a sensible next chunk, then the next, over and over. Each new chunk is sent to your screen the moment it's ready, which is why the answer seems to type itself out.",

  facts: [
    { label: 'Launched', value: 'November 30, 2022' },
    { label: 'Made by', value: 'OpenAI (founded December 2015)' },
    { label: 'Headquarters', value: 'San Francisco, California' },
    { label: 'Early growth', value: '1 million users in about 5 days; an estimated 100 million in about 2 months' },
    { label: 'Users', value: '900 million+ weekly users (OpenAI, February 2026)' },
    { label: 'Main cloud partner', value: 'Microsoft Azure (OpenAI also uses other clouds)' },
    { label: 'Known for (tech)', value: 'Streaming answers from large language models trained with human feedback (RLHF)' },
  ],

  history: [
    {
      year: '2015',
      title: 'OpenAI is founded',
      detail:
        'OpenAI started in December 2015 in San Francisco as a non-profit research lab with the goal of building artificial intelligence that benefits everyone.',
    },
    {
      year: '2020',
      title: 'GPT-3 and an Azure supercomputer',
      detail:
        'Microsoft, which invested $1 billion in OpenAI in 2019, announced a supercomputer built on Azure for OpenAI with about 10,000 GPUs. The same year OpenAI released GPT-3, a 175-billion-parameter language model, through its API.',
    },
    {
      year: '2021',
      title: 'Kubernetes at 7,500 nodes',
      detail:
        "OpenAI's engineers wrote about scaling their Kubernetes clusters to 7,500 machines to train big models, sharing the problems they hit and how they fixed them.",
    },
    {
      year: '2022',
      title: 'InstructGPT and RLHF',
      detail:
        "OpenAI published InstructGPT, which used reinforcement learning from human feedback (RLHF) so a model follows instructions instead of just continuing text. ChatGPT's launch post said it was trained with the same methods.",
    },
    {
      year: '2022',
      title: 'ChatGPT launches',
      detail:
        'On November 30, 2022, ChatGPT launched as a free "research preview" built on a GPT-3.5 model. It passed 1 million users in about five days.',
    },
    {
      year: '2023',
      title: '100 million users and ChatGPT Plus',
      detail:
        'Analysts estimated ChatGPT reached 100 million monthly users by January 2023, about two months after launch. In February OpenAI launched ChatGPT Plus, a $20-a-month subscription.',
    },
    {
      year: '2023',
      title: 'GPT-4, a caching bug and mobile apps',
      detail:
        "GPT-4 arrived in March. That same month a bug in an open-source Redis library briefly showed some users other people's chat titles, and OpenAI published a detailed report. The iPhone app followed in May and the Android app in July.",
    },
    {
      year: '2023',
      title: 'Voice, images and custom GPTs',
      detail:
        'In September ChatGPT learned to listen, talk and look at images you upload. In November, at its first developer conference, OpenAI announced GPTs: custom versions of ChatGPT anyone can build.',
    },
    {
      year: '2024',
      title: 'GPT-4o, chatgpt.com, reasoning and search',
      detail:
        'In May, GPT-4o arrived as a faster model that can handle text, images and audio, and ChatGPT moved to the chatgpt.com address. In September previews of the o1 "reasoning" models took time to think before answering, and ChatGPT search launched in October.',
    },
    {
      year: '2025',
      title: 'GPT-5 and 800 million weekly users',
      detail:
        'GPT-5 launched in August 2025. In October, OpenAI said ChatGPT was being used by 800 million people every week.',
    },
  ],

  languages: [
    { name: 'Python', usedFor: 'AI research, model training (PyTorch) and services close to the models', share: 35 },
    { name: 'TypeScript', usedFor: 'The chatgpt.com web app', share: 20 },
    { name: 'C++ / CUDA', usedFor: 'Speed-critical math that runs on the GPUs', share: 15 },
    { name: 'Swift / Kotlin', usedFor: 'The iPhone and Android apps', share: 15 },
    { name: 'Rust', usedFor: 'Fast building blocks such as the core of the tiktoken tokenizer', share: 10 },
    { name: 'SQL', usedFor: 'Reading and writing accounts and chats in PostgreSQL', share: 5 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'React',
          role: 'Building the chat interface',
          beginnerNote:
            "Builds pages out of reusable pieces called components; people who inspect chatgpt.com see signs of React, though OpenAI hasn't published a full breakdown.",
          confidence: 'likely',
        },
        {
          name: 'TypeScript',
          role: 'Language of the web app',
          beginnerNote:
            'JavaScript with types added, so mistakes like passing a number where text was expected are caught before the code runs.',
          confidence: 'likely',
        },
        {
          name: 'Markdown rendering',
          role: 'Formatting replies',
          beginnerNote:
            'The model writes simple formatting marks like **bold** and code fences, and the app turns them into headings, lists, tables and colored code blocks.',
          confidence: 'likely',
        },
        {
          name: 'Server-Sent Events',
          role: 'Streaming the answer',
          beginnerNote:
            "A simple way for a server to keep one HTTP response open and push small messages down it; OpenAI's API documents streaming this way, and the ChatGPT site appears to use the same idea.",
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Mobile',
      items: [
        {
          name: 'Swift & SwiftUI (iOS)',
          role: 'iPhone app',
          beginnerNote:
            "Swift is Apple's modern language for iPhone apps, and SwiftUI lets you describe a screen so it redraws itself when data, like a streaming reply, changes.",
          confidence: 'likely',
        },
        {
          name: 'Kotlin & Jetpack Compose (Android)',
          role: 'Android app',
          beginnerNote:
            "Kotlin is Google's recommended language for Android, and Compose is its toolkit for building screens out of small functions.",
          confidence: 'likely',
        },
        {
          name: 'WebRTC',
          role: 'Real-time voice conversations',
          beginnerNote:
            'The same technology video-call apps use to send live audio with very little delay, which suits talking back and forth with an AI.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Python services',
          role: 'Server code near the models',
          beginnerNote:
            "Python is OpenAI's main language for AI research, so it's a natural fit for services that talk to the models, although OpenAI hasn't published its full backend stack.",
          confidence: 'likely',
        },
        {
          name: 'Sign in with Google, Apple or Microsoft',
          role: 'Accounts & login',
          beginnerNote:
            'Besides email, you can log in with an account you already have, so the app gets proof of who you are without handling another password.',
          confidence: 'confirmed',
        },
        {
          name: 'Usage limits per plan',
          role: 'Sharing expensive GPUs fairly',
          beginnerNote:
            'Every answer costs real computer time, so each plan allows a certain amount of use of the biggest models, and the servers keep count.',
          confidence: 'confirmed',
        },
        {
          name: 'Tool calling',
          role: 'Search, code and file tools',
          beginnerNote:
            "Instead of answering right away, the model can ask for a tool, like 'search the web for X'; the server runs it and hands the results back so the model can finish.",
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'PostgreSQL',
          role: 'Core database for accounts and chats',
          beginnerNote:
            'A classic table-based database; OpenAI engineers have described running ChatGPT data on one main PostgreSQL server that takes writes plus many read-only copies (replicas).',
          confidence: 'confirmed',
        },
        {
          name: 'Redis',
          role: 'In-memory cache',
          beginnerNote:
            "Super-fast short-term memory; OpenAI's report on a March 2023 incident explained that ChatGPT uses Redis to cache user information.",
          confidence: 'confirmed',
        },
        {
          name: 'Azure Cosmos DB',
          role: 'Database for huge write volumes',
          beginnerNote:
            "Microsoft's database that spreads data over many machines to handle enormous numbers of writes; OpenAI has said it moved write-heavy data that can be split up onto Cosmos DB to take pressure off PostgreSQL.",
          confidence: 'confirmed',
        },
        {
          name: 'Blob storage',
          role: 'Uploaded files and images',
          beginnerNote:
            'Files you upload, like PDFs and photos, sit in cheap file storage (such as Azure Blob Storage) while the database only keeps a pointer to each one.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'GPT models (Transformers)',
          role: 'Writes the replies',
          beginnerNote:
            'GPT stands for Generative Pre-trained Transformer: a neural network that read a huge amount of text and learned to predict the next token.',
          confidence: 'confirmed',
        },
        {
          name: 'RLHF',
          role: 'Turning a text predictor into a helpful assistant',
          beginnerNote:
            'People ranked different answers from best to worst, and the model was trained to prefer the kinds of answers people rated highly.',
          confidence: 'confirmed',
        },
        {
          name: 'PyTorch',
          role: 'Training framework',
          beginnerNote:
            'An open-source toolkit for building and training neural networks, which OpenAI announced as its standard framework in 2020.',
          confidence: 'confirmed',
        },
        {
          name: 'tiktoken',
          role: 'Tokenizer',
          beginnerNote:
            "OpenAI's open-source tokenizer, with a core written in Rust, chops text into the numbered tokens that the models actually read.",
          confidence: 'confirmed',
        },
        {
          name: 'Moderation models',
          role: 'Safety checks',
          beginnerNote:
            'OpenAI publishes a Moderation model that flags harmful text, and safety checks like it help keep ChatGPT conversations within its usage policies.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Microsoft Azure',
          role: 'Cloud computing',
          beginnerNote:
            "Microsoft's cloud; OpenAI started running big experiments on it in 2016, Microsoft invested $1 billion in 2019, and Azure has provided much of the computing power used to train and run OpenAI's models.",
          confidence: 'confirmed',
        },
        {
          name: 'NVIDIA GPUs',
          role: 'Chips that run the models',
          beginnerNote:
            'Graphics chips can do thousands of multiplications at the same time, which is exactly the math neural networks need; Microsoft has described linking tens of thousands of them for OpenAI.',
          confidence: 'confirmed',
        },
        {
          name: 'Kubernetes',
          role: 'Running programs across many machines',
          beginnerNote:
            'Software that starts, stops and moves containers around a fleet of computers; OpenAI wrote in 2021 about running Kubernetes clusters of 7,500 machines.',
          confidence: 'confirmed',
        },
        {
          name: 'Cloudflare',
          role: 'Edge network & bot protection',
          beginnerNote:
            "A network that sits in front of websites to speed them up and block fake traffic; chatgpt.com's responses carry Cloudflare's server headers, and it's why the site sometimes asks you to confirm you're human.",
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'DevOps',
      items: [
        {
          name: 'Status page & incident reports',
          role: 'Being open about outages',
          beginnerNote:
            'status.openai.com shows when parts of ChatGPT are having trouble, and after big outages OpenAI publishes write-ups explaining what went wrong.',
          confidence: 'confirmed',
        },
        {
          name: 'Staged rollouts',
          role: 'Releasing features gradually',
          beginnerNote:
            'New features often reach one group first, like paid users or certain countries, so problems (and GPU shortages) show up before everyone gets them.',
          confidence: 'likely',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      // Tier 0: clients
      {
        id: 'web-app',
        label: 'chatgpt.com',
        kind: 'client',
        tier: 0,
        tech: 'React & TypeScript (likely)',
        description:
          'The website version of ChatGPT running in your browser. It shows your chats, sends your messages and paints the reply as it streams in.',
      },
      {
        id: 'mobile-app',
        label: 'Mobile apps',
        kind: 'client',
        tier: 0,
        tech: 'Swift (iOS) & Kotlin (Android)',
        description:
          'The iPhone and Android apps. They talk to the same backend as the website and add phone features like voice conversations and the camera.',
      },
      // Tier 1: edge
      {
        id: 'edge',
        label: 'Edge network',
        kind: 'edge',
        tier: 1,
        tech: 'CDN & bot protection (Cloudflare)',
        description:
          "The first stop for every request. It serves the website's files from a server near you and blocks floods of fake or automated traffic.",
      },
      {
        id: 'lb',
        label: 'Load balancer',
        kind: 'edge',
        tier: 1,
        tech: 'Cloud load balancers (details not public)',
        description:
          'Spreads incoming requests across many identical backend servers, so no single server gets overloaded.',
      },
      // Tier 2: API / gateway
      {
        id: 'api',
        label: 'Backend API',
        kind: 'gateway',
        tier: 2,
        tech: 'HTTPS + JSON, streaming with Server-Sent Events',
        description:
          'The front door for app requests. It lists your chats, checks your usage limits and starts new replies, keeping the connection open while they stream.',
      },
      {
        id: 'auth',
        label: 'Accounts & login',
        kind: 'service',
        tier: 2,
        tech: 'Email or Google / Apple / Microsoft sign-in, session tokens',
        description:
          'Checks the login token your app sends with every request, so the backend knows who you are and which plan you have.',
      },
      // Tier 3: services & workers
      {
        id: 'chat',
        label: 'Conversation service',
        kind: 'service',
        tier: 3,
        tech: 'Python services (likely)',
        description:
          'Builds the prompt from the instructions and your chat history, trims it to fit the model, runs tools when asked and passes tokens back as they arrive.',
      },
      {
        id: 'moderation',
        label: 'Safety checks',
        kind: 'ml',
        tier: 3,
        tech: 'Moderation classifiers',
        description:
          'Smaller AI models that score text for things like violence or self-harm, so content that breaks the usage policies can be flagged or blocked.',
      },
      {
        id: 'inference',
        label: 'Model servers',
        kind: 'ml',
        tier: 3,
        tech: 'GPT models on NVIDIA GPUs (Azure and other clouds)',
        description:
          'Racks of GPU machines running the language model. They read your conversation as tokens and predict the reply one token at a time.',
      },
      {
        id: 'search',
        label: 'Web search',
        kind: 'external',
        tier: 3,
        tech: 'Third-party search providers',
        description:
          'Outside search services that return fresh web results when a question needs information newer than what the model learned in training.',
      },
      // Tier 4: data & storage
      {
        id: 'postgres',
        label: 'PostgreSQL',
        kind: 'database',
        tier: 4,
        tech: 'PostgreSQL (one primary + read replicas)',
        description:
          'Stores accounts, conversations and messages in tables. One main server takes the writes, and many copies answer the much more common reads.',
      },
      {
        id: 'redis',
        label: 'Redis cache',
        kind: 'cache',
        tier: 4,
        tech: 'Redis',
        description:
          'Very fast temporary memory for things checked constantly, like login sessions and how many messages you have sent recently.',
      },
      {
        id: 'files',
        label: 'File storage',
        kind: 'storage',
        tier: 4,
        tech: 'Blob storage (such as Azure Blob Storage)',
        description:
          'Holds the actual bytes of PDFs, photos and other files you upload. The database only stores a pointer to each file.',
      },
    ],
    edges: [
      { from: 'web-app', to: 'edge', label: 'HTTPS' },
      { from: 'mobile-app', to: 'edge', label: 'HTTPS' },
      { from: 'edge', to: 'lb', label: 'HTTPS' },
      { from: 'lb', to: 'api', label: 'HTTP' },
      { from: 'api', to: 'auth', label: 'check session' },
      { from: 'auth', to: 'postgres', label: 'SQL (accounts)' },
      { from: 'auth', to: 'redis', label: 'session cache' },
      { from: 'api', to: 'redis', label: 'usage counters' },
      { from: 'api', to: 'postgres', label: 'SQL (chat list)' },
      { from: 'api', to: 'chat', label: 'internal RPC' },
      { from: 'api', to: 'files', label: 'store uploads' },
      { from: 'chat', to: 'postgres', label: 'SQL (messages)' },
      { from: 'chat', to: 'moderation', label: 'check text' },
      { from: 'chat', to: 'inference', label: 'tokens in / tokens out' },
      { from: 'chat', to: 'search', label: 'HTTPS (search query)' },
      { from: 'chat', to: 'files', label: 'read attachments' },
    ],
    flows: [
      {
        id: 'send-message',
        title: 'You send a message',
        emoji: '💬',
        steps: [
          {
            from: 'web-app',
            to: 'edge',
            narration:
              "You type a question and press Enter. Your browser sends the message and the conversation's ID over a secure HTTPS connection and keeps that connection open for the answer.",
          },
          {
            from: 'edge',
            to: 'lb',
            narration:
              'The edge network checks that the request looks like it came from a real person, not a bot flood, and passes it toward the servers.',
          },
          {
            from: 'lb',
            to: 'api',
            narration: "A load balancer picks a backend server that isn't too busy.",
          },
          {
            from: 'api',
            to: 'auth',
            narration: 'The backend checks your login token to find out who you are and which plan you are on.',
          },
          {
            from: 'api',
            to: 'redis',
            narration:
              "It looks at a fast counter in Redis to make sure you haven't hit your usage limit for the model you picked.",
          },
          {
            from: 'api',
            to: 'chat',
            narration: 'Everything checks out, so it hands your message to the conversation service, which is in charge of producing the reply.',
          },
          {
            from: 'chat',
            to: 'postgres',
            narration:
              'The conversation service saves your message and loads the earlier messages in this chat, because the model needs the whole conversation to understand your question.',
          },
        ],
      },
      {
        id: 'stream-reply',
        title: 'The answer types itself out',
        emoji: '✨',
        steps: [
          {
            from: 'chat',
            to: 'inference',
            narration:
              'The conversation service turns the instructions plus your chat history into tokens and sends them to a model server with free GPUs.',
          },
          {
            from: 'inference',
            to: 'chat',
            narration:
              "The model predicts one next token, adds it to the input, and predicts again. Each token is sent back the instant it's made instead of waiting for the whole answer.",
          },
          {
            from: 'chat',
            to: 'moderation',
            narration:
              'Along the way, safety classifiers check the conversation, so content that breaks the usage policies can be flagged or stopped.',
          },
          {
            from: 'chat',
            to: 'api',
            narration: 'New text is passed up in small chunks to the backend server that is still holding your connection open.',
          },
          {
            from: 'api',
            to: 'lb',
            narration:
              "The backend writes each chunk into the open response as a tiny Server-Sent Event, a line that starts with 'data:'.",
          },
          {
            from: 'lb',
            to: 'edge',
            narration: 'The events flow back through the load balancer and edge network without being bundled up or delayed.',
          },
          {
            from: 'edge',
            to: 'web-app',
            narration:
              'Your browser adds each chunk to the reply bubble as it lands. A final "[DONE]" event says the answer is complete, and the server saves the full reply to the database.',
          },
        ],
      },
      {
        id: 'web-search',
        title: "You ask about last night's game",
        emoji: '🔎',
        steps: [
          {
            from: 'mobile-app',
            to: 'edge',
            narration:
              "On your phone you ask, 'Who won the game last night?' The app sends it over HTTPS like any other message.",
          },
          {
            from: 'edge',
            to: 'lb',
            narration: 'The request passes through the edge network to a load balancer.',
          },
          {
            from: 'lb',
            to: 'api',
            narration: 'A backend server receives it and runs the usual login and usage-limit checks.',
          },
          {
            from: 'api',
            to: 'chat',
            narration:
              'The conversation service builds the prompt, including a list of tools the model is allowed to use, such as web search.',
          },
          {
            from: 'chat',
            to: 'inference',
            narration:
              "The model's training data can't include last night, so instead of guessing it replies with a tool call: a structured request meaning 'search the web for last night's score'.",
          },
          {
            from: 'chat',
            to: 'search',
            narration:
              'The conversation service runs that search with a search provider and collects the top results as short snippets with links.',
          },
          {
            from: 'chat',
            to: 'inference',
            narration:
              'The results are added to the conversation and sent back to the model, which writes an answer that cites its sources and streams to your phone.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'web/src/routes/ChatPage.tsx', note: 'The chat screen for one conversation' },
    { path: 'web/src/components/MessageList.tsx', note: "Shows your messages and the assistant's replies, scrolling as text arrives" },
    { path: 'web/src/components/Composer.tsx', note: 'The input box with the send and stop buttons' },
    { path: 'web/src/components/Markdown.tsx', note: 'Turns Markdown in replies into lists, tables and highlighted code' },
    { path: 'web/src/lib/streamReply.ts', note: 'Reads the streamed reply chunk by chunk' },
    { path: 'ios/Chat/ChatView.swift', note: 'SwiftUI chat screen on iPhone' },
    { path: 'ios/Chat/ChatViewModel.swift', note: 'Sends a message and collects the streamed reply on iPhone' },
    { path: 'android/chat/ChatScreen.kt', note: 'Jetpack Compose chat screen on Android' },
    { path: 'backend/api/conversation.py', note: 'Endpoint that starts a reply and streams it back as Server-Sent Events' },
    { path: 'backend/api/auth.py', note: 'Checks login tokens and which plan you are on' },
    { path: 'backend/api/usage_limits.py', note: 'Counts messages per user so GPUs are shared fairly' },
    { path: 'backend/chat/prompt_builder.py', note: 'Combines instructions and chat history into one prompt' },
    { path: 'backend/chat/context_window.py', note: "Trims or summarizes old messages so a chat fits the model's token limit" },
    { path: 'backend/tools/web_search.py', note: 'Runs a search when the model asks for fresh information' },
    { path: 'backend/safety/moderation.py', note: 'Sends text to safety classifiers and handles anything flagged' },
    { path: 'inference/generate.py', note: 'The next-token loop that runs on GPU servers' },
    { path: 'tokenizer/src/bpe.rs', note: 'Byte pair encoding: turns text into token IDs' },
    { path: 'db/schema/conversations.sql', note: 'Tables for users, conversations and the message tree' },
    { path: 'training/rlhf/reward_model.py', note: 'Learns to score answers the way human reviewers ranked them' },
    { path: 'deploy/k8s/model-server.yaml', note: 'Kubernetes config that asks for GPU machines to run the model' },
  ],

  code: [
    {
      id: 'ts-stream-reader',
      title: 'Reading a streamed reply in the browser',
      file: 'web/src/lib/streamReply.ts',
      language: 'TypeScript',
      explanation:
        "The browser's built-in EventSource only supports GET requests, so chat apps often use fetch and read the response body as a stream instead. This simplified reader decodes bytes into text, splits it into events at each blank line, saves any half-received event for the next loop, and hands each new piece of text to the UI. It's an illustration of the technique, not ChatGPT's real code.",
      code: `// Sends your message, then reads the reply piece by piece as it arrives.
export async function streamReply(
  message: string,
  onDelta: (text: string) => void, // called with each new bit of text
  signal?: AbortSignal, // lets a Stop button cancel the reply
): Promise<void> {
  const res = await fetch('/api/conversation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify({ message }),
    signal,
  });
  if (!res.ok || !res.body) throw new Error(\`Request failed: \${res.status}\`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read(); // waits for the next network chunk
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Events end with a blank line. The last piece may be only half here, so keep it.
    const events = buffer.split('\\n\\n');
    buffer = events.pop() ?? '';

    for (const event of events) {
      const data = event.replace(/^data: /, '');
      if (data === '[DONE]') return; // the server says the answer is finished
      onDelta(JSON.parse(data).delta);
    }
  }
}`,
    },
    {
      id: 'python-next-token-loop',
      title: 'The next-token loop, streamed',
      file: 'backend/api/conversation.py',
      language: 'Python',
      explanation:
        "Every chatbot reply comes from a loop: get a score for every possible next token, pick one (temperature decides how adventurous the pick is), add it to the input, and repeat. This simplified FastAPI endpoint sends each token to the client as a Server-Sent Event the moment it's chosen, which is why answers appear word by word. In a real system the model runs on separate GPU servers that process many people's requests together.",
      code: `import json
import math
import random

from fastapi import FastAPI
from fastapi.responses import StreamingResponse

from model import next_token_scores, tokenizer  # stand-ins for a real GPU model server

app = FastAPI()


def pick_token(scores, temperature):
    # Softmax: turn raw scores into weights. Low temperature = safer, more predictable picks
    top = max(scores.values())
    weights = [math.exp((s - top) / temperature) for s in scores.values()]
    return random.choices(list(scores.keys()), weights=weights)[0]


def generate(messages, temperature=0.8, max_new_tokens=500):
    tokens = tokenizer.encode_chat(messages)  # the WHOLE conversation, as token IDs
    for _ in range(max_new_tokens):
        scores = next_token_scores(tokens)    # {token_id: score} for every possible next token
        token = pick_token(scores, temperature)
        if token == tokenizer.end_of_turn:
            break
        tokens.append(token)                  # the new token becomes part of the next input
        chunk = json.dumps({"delta": tokenizer.decode([token])})
        yield f"data: {chunk}\\n\\n"            # one Server-Sent Event, sent right away
    yield "data: [DONE]\\n\\n"


@app.post("/conversation")
async def conversation(body: dict):
    return StreamingResponse(
        generate(body["messages"]),
        media_type="text/event-stream",
    )`,
    },
    {
      id: 'rust-bpe-tokenizer',
      title: 'Turning text into tokens (byte pair encoding)',
      file: 'tokenizer/src/bpe.rs',
      language: 'Rust',
      explanation:
        "Models don't read letters or words; they read token IDs. OpenAI's open-source tokenizer, tiktoken, uses byte pair encoding (BPE) with a fast core written in Rust. This toy version starts with single bytes and keeps merging the neighboring pair that was learned earliest (lowest rank), so common words end up as a single token. Real tokenizers first split text into word-like pieces with a regular expression and merge far more efficiently.",
      code: `use std::collections::HashMap;

/// Byte pair encoding, simplified. \`ranks\` maps a byte sequence to its token ID;
/// lower IDs were learned earlier because they were more common in training text.
/// Every single byte (0-255) is in the table, so any text can be encoded.
pub fn encode(text: &str, ranks: &HashMap<Vec<u8>, u32>) -> Vec<u32> {
    // 1. Every byte starts as its own piece: "chat" -> ["c", "h", "a", "t"]
    let mut pieces: Vec<Vec<u8>> = text.bytes().map(|b| vec![b]).collect();

    loop {
        // 2. Look at each neighboring pair and find the best-ranked merge
        let mut best: Option<(usize, u32)> = None;
        for i in 0..pieces.len().saturating_sub(1) {
            let merged = [pieces[i].as_slice(), pieces[i + 1].as_slice()].concat();
            if let Some(&rank) = ranks.get(&merged) {
                if best.map_or(true, |(_, r)| rank < r) {
                    best = Some((i, rank));
                }
            }
        }

        // 3. No known pair left? Merging is finished.
        let Some((i, _)) = best else { break };
        let right = pieces.remove(i + 1);
        pieces[i].extend(right); // ["c", "h"] becomes ["ch"]
    }

    // 4. Swap each piece for its ID number, which is what the model actually reads
    pieces.iter().map(|p| ranks[p]).collect()
}`,
    },
    {
      id: 'sql-conversation-tree',
      title: 'Storing chats as a tree of messages',
      file: 'db/schema/conversations.sql',
      language: 'SQL',
      explanation:
        "A plausible way to store chats; OpenAI hasn't published its real schema. Each message points to its parent, so when you edit an earlier message a new branch grows from the same parent instead of erasing what came after. That matches how ChatGPT lets you flip between versions of an edited message. The recursive query walks from the newest message back to the start to rebuild the branch you're looking at.",
      code: `CREATE TABLE users (
    id         uuid PRIMARY KEY,
    email      text UNIQUE NOT NULL,
    plan       text NOT NULL DEFAULT 'free',  -- decides your usage limits
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Each chat in your history list is one conversation
CREATE TABLE conversations (
    id         uuid PRIMARY KEY,
    user_id    uuid NOT NULL REFERENCES users (id),
    title      text,                          -- a short auto-generated title
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON conversations (user_id, updated_at DESC);  -- "my recent chats"

-- Messages form a tree: editing an old message starts a new branch
CREATE TABLE messages (
    id              uuid PRIMARY KEY,
    conversation_id uuid NOT NULL REFERENCES conversations (id),
    parent_id       uuid REFERENCES messages (id),  -- NULL for the first message
    role            text NOT NULL CHECK (role IN ('system', 'user', 'assistant', 'tool')),
    content         text NOT NULL,
    token_count     integer NOT NULL,  -- helps fit the chat into the context window
    created_at      timestamptz NOT NULL DEFAULT now()
);

-- Rebuild one branch: start at the newest message and follow parent links back
WITH RECURSIVE branch AS (
    SELECT * FROM messages WHERE id = $1
    UNION ALL
    SELECT m.* FROM messages m JOIN branch b ON m.id = b.parent_id
)
SELECT role, content FROM branch ORDER BY created_at;`,
    },
    {
      id: 'swift-streaming-chat',
      title: 'Streaming a reply on iPhone',
      file: 'ios/Chat/ChatViewModel.swift',
      language: 'Swift',
      explanation:
        "URLSession's bytes(for:) hands you the response while it's still downloading, so you can loop over it line by line with for try await. Each 'data:' line carries a little JSON chunk that gets added to replyText, and because that property is @Published, SwiftUI redraws the message bubble automatically. isStreaming drives the typing indicator, and defer switches it off however the function ends.",
      code: `import Foundation

struct Delta: Decodable { let delta: String }

@MainActor
final class ChatViewModel: ObservableObject {
    @Published var replyText = ""
    @Published var isStreaming = false  // the screen shows typing dots while true

    func send(_ message: String) async {
        var request = URLRequest(url: URL(string: "https://api.example.com/conversation")!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONEncoder().encode(["message": message])

        replyText = ""
        isStreaming = true
        defer { isStreaming = false }  // runs when send() finishes, even after an error

        do {
            // bytes(for:) gives us the response while it is still arriving
            let (bytes, _) = try await URLSession.shared.bytes(for: request)
            for try await line in bytes.lines {
                guard line.hasPrefix("data: ") else { continue }
                let payload = line.dropFirst(6)  // remove "data: "
                if payload == "[DONE]" { break }
                if let chunk = try? JSONDecoder().decode(Delta.self, from: Data(payload.utf8)) {
                    replyText += chunk.delta  // SwiftUI redraws the bubble for us
                }
            }
        } catch {
            replyText += "\\n\\n(Connection lost. Tap to try again.)"
        }
    }
}`,
    },
  ],

  playground: {
    title: 'Mini chat with streaming',
    description:
      'A pocket-sized chat screen: type a message, press send, and watch a canned reply appear after a typing indicator, one word at a time, just like a real streamed answer.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mini chat</title>
<style>
:root {
  --brand: #10A37F; /* @tweak color "Brand color" */
  --bg: #FFFFFF; /* @tweak color "Background" */
  --text: #202123; /* @tweak color "Text color" */
  --bubble: #F1F1F3; /* @tweak color "Your bubble" */
  --radius: 20px; /* @tweak range 0 28 "Bubble corners" */
  --font: 15px; /* @tweak range 12 22 "Text size" */
}
* { box-sizing: border-box; }
html, body { height: 100%; }
body {
  margin: 0; display: flex; flex-direction: column;
  background: var(--bg); color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: var(--font); line-height: 1.5;
}
button { border: 0; background: none; color: inherit; font: inherit; cursor: pointer; }

/* Top bar */
.topbar { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid rgba(128, 128, 128, 0.2); }
.topbar h1 { margin: 0; font-size: 17px; }
.model { font-size: 12px; padding: 2px 10px; border-radius: 99px; background: var(--bubble); }
.new { margin-left: auto; font-size: 18px; }

/* Message list: fills the free space and scrolls */
.messages { flex: 1; overflow-y: auto; padding: 16px 14px; display: flex; flex-direction: column; gap: 16px; }
.welcome { margin: auto; text-align: center; font-size: 22px; font-weight: 600; }
.msg { white-space: pre-wrap; overflow-wrap: anywhere; }
.msg.user { align-self: flex-end; max-width: 85%; padding: 8px 14px; background: var(--bubble); border-radius: var(--radius); }
.msg.bot { display: flex; gap: 10px; }
.avatar { flex: none; width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; background: var(--brand); color: #fff; font-size: 14px; }

/* Typing indicator (three bouncing dots) and a blinking cursor while words stream in */
.dots { padding-top: 8px; }
.dots span { display: inline-block; width: 7px; height: 7px; margin-right: 4px; border-radius: 50%; background: var(--text); opacity: 0.4; animation: bounce 1s infinite; }
.dots span:nth-child(2) { animation-delay: 0.15s; }
.dots span:nth-child(3) { animation-delay: 0.3s; }
@keyframes bounce { 30% { transform: translateY(-5px); } }
.cursor::after { content: "▍"; color: var(--brand); animation: blink 0.8s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }

/* Input bar */
.composer { display: flex; align-items: center; gap: 8px; margin: 0 12px; padding: 6px 6px 6px 16px; border: 1px solid rgba(128, 128, 128, 0.35); border-radius: calc(var(--radius) + 8px); }
.composer input { flex: 1; min-width: 0; border: 0; outline: none; background: transparent; color: var(--text); font: inherit; }
.send { flex: none; width: 36px; height: 36px; border-radius: 50%; background: var(--brand); color: #fff; font-size: 18px; }
.send:disabled { opacity: 0.35; cursor: default; }
.note { margin: 6px 12px 10px; text-align: center; font-size: 11px; opacity: 0.6; }
</style>
</head>
<body>
  <header class="topbar">
    <button aria-label="Menu">☰</button>
    <h1 data-edit="app-name">ChatGPT</h1>
    <span class="model" data-edit="model">Mini model</span>
    <button class="new" id="new-chat" aria-label="New chat">✎</button>
  </header>

  <main class="messages" id="messages">
    <p class="welcome" id="welcome" data-edit="greeting">What can I help with?</p>
  </main>

  <form class="composer" id="composer">
    <input id="input" placeholder="Ask anything" autocomplete="off" enterkeyhint="send">
    <button type="button" class="send" id="send" aria-label="Send" disabled>↑</button>
  </form>
  <p class="note" data-edit="disclaimer">AI can make mistakes. Check important info.</p>

<script>
  // Canned replies. A real app gets text from a model, one token at a time.
  const replies = [
    "Good question! A language model writes its answer one small chunk of text at a time, called a token. The server sends each token as soon as it is ready, so you can start reading before the answer is finished.",
    "Here is a secret: there is no AI in this demo. The reply is split into words, and a timer adds one word every few milliseconds, just like tokens arriving over a streaming connection.",
    "Try changing the brand color or the bubble corners with the controls, then send another message to see the new style."
  ];
  const WORD_DELAY = 60; // milliseconds between words

  const list = document.getElementById('messages');
  const input = document.getElementById('input');
  const sendBtn = document.getElementById('send');
  const welcome = document.getElementById('welcome');
  let replyIndex = 0;
  let timer = null; // not null while a reply is streaming

  function addMessage(role) {
    const row = document.createElement('div');
    row.className = 'msg ' + role;
    list.appendChild(row);
    return row;
  }
  function scrollDown() { list.scrollTop = list.scrollHeight; }

  // While streaming, the send button turns into a stop button
  function updateButton() {
    sendBtn.textContent = timer ? '■' : '↑';
    sendBtn.disabled = !timer && input.value.trim() === '';
  }

  function streamReply() {
    const row = addMessage('bot');
    row.innerHTML = '<div class="avatar">✦</div><div class="dots"><span></span><span></span><span></span></div>';
    const words = replies[replyIndex++ % replies.length].split(' ');
    let i = 0;
    // A short "thinking" pause with the typing dots, then one word per tick
    timer = setTimeout(() => {
      const text = row.lastChild;
      text.className = 'cursor';
      text.textContent = '';
      timer = setInterval(() => {
        text.textContent += (i === 0 ? '' : ' ') + words[i++];
        scrollDown();
        if (i === words.length) stop();
      }, WORD_DELAY);
    }, 800);
    updateButton();
    scrollDown();
  }

  function stop() {
    clearTimeout(timer);
    clearInterval(timer);
    timer = null;
    const dots = list.querySelector('.dots');
    if (dots) dots.parentElement.remove(); // stopped before any words arrived
    const typing = list.querySelector('.cursor');
    if (typing) typing.classList.remove('cursor');
    updateButton();
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text || timer) return;
    welcome.hidden = true;
    addMessage('user').textContent = text; // textContent keeps user text from running as HTML
    input.value = '';
    streamReply();
  }

  sendBtn.addEventListener('click', () => (timer ? stop() : sendMessage()));
  input.addEventListener('input', updateButton);
  document.getElementById('composer').addEventListener('submit', (e) => {
    e.preventDefault(); // pressing Enter sends instead of reloading the page
    sendMessage();
  });
  document.getElementById('new-chat').addEventListener('click', () => {
    if (timer) stop();
    list.querySelectorAll('.msg').forEach((m) => m.remove());
    welcome.hidden = false;
  });
</script>
</body>
</html>`,
    challenges: [
      'Change --brand to #AB68FF, then send a message: the send button, the avatar and the blinking cursor all turn purple.',
      'Make a dark mode by setting --bg to #212121, --text to #ECECEC and --bubble to #303030.',
      'Find WORD_DELAY in the script and change 60 to 250 so the reply types slowly, then press the ■ button halfway through to stop it.',
      'Edit the greeting and model name, then add your own sentence to the replies list and keep sending messages until it shows up.',
    ],
  },

  concepts: [
    {
      term: 'Large language model (LLM)',
      meaning:
        'A huge neural network trained on enormous amounts of text to predict the next piece of text. Doing that over and over lets it write whole answers.',
    },
    {
      term: 'Token',
      meaning:
        'A small chunk of text, often a whole word or part of one (about 4 characters of English on average). Models read and write tokens, and limits and prices are counted in them.',
    },
    {
      term: 'Inference',
      meaning:
        'Using an already-trained model to produce an answer. Training builds the model ahead of time; inference happens every single time someone sends a message.',
    },
    {
      term: 'RLHF (reinforcement learning from human feedback)',
      meaning:
        'A training step where people rank a model\'s answers, a helper model learns to predict those rankings, and the main model is then tuned to produce answers that score well.',
    },
    {
      term: 'Context window',
      meaning:
        'The most tokens a model can look at in one go. The instructions, chat history and reply all have to fit, so very long chats need older parts trimmed or summarized.',
    },
    {
      term: 'Streaming (Server-Sent Events)',
      meaning:
        "Sending a response in pieces while it's still being created. With Server-Sent Events, the server keeps one HTTP response open and pushes small 'data:' messages down it.",
    },
    {
      term: 'Temperature',
      meaning:
        "A setting for how adventurous the model's word choices are. Low temperature almost always picks the most likely token; higher temperature gives more varied, creative text.",
    },
    {
      term: 'GPU',
      meaning:
        'A graphics chip that can do thousands of simple math operations at the same time, which is exactly the kind of work neural networks need.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Make your first model call',
      detail:
        "Sign up for an LLM API (such as OpenAI's) and write a short Python or Node script that sends one message and prints the reply. Keep the API key in an environment variable, never in your code.",
    },
    {
      step: 'Put a small server in the middle',
      detail:
        'Create an Express or FastAPI endpoint like POST /chat that adds your secret key and calls the model. Your app talks to your server, so the key never ships inside the app.',
    },
    {
      step: 'Build the chat screen',
      detail:
        'In React, keep an array of messages in state and render it as bubbles, with an input box and a send button at the bottom. Add your own message to the array the moment you press send.',
    },
    {
      step: 'Stream the reply',
      detail:
        "Turn on streaming in the API call, forward each chunk from your server as a Server-Sent Event, and read it in the browser with fetch's body reader, appending text to the last bubble. Show typing dots until the first chunk arrives.",
    },
    {
      step: 'Remember conversations',
      detail:
        'Save conversations and messages tables in SQLite or Supabase, send the recent history with each request so the model has context, and list past chats newest first.',
    },
    {
      step: 'Stay inside the limits',
      detail:
        'Count tokens with a tokenizer like tiktoken, trim or summarize the oldest messages when a chat gets long, add a Stop button, and cap how many messages each user can send per hour.',
    },
  ],

  sources: [
    { label: 'OpenAI (official site)', url: 'https://openai.com' },
    { label: 'Wikipedia: ChatGPT', url: 'https://en.wikipedia.org/wiki/ChatGPT' },
    { label: 'Wikipedia: OpenAI', url: 'https://en.wikipedia.org/wiki/OpenAI' },
    {
      label: 'InstructGPT paper: Training language models to follow instructions with human feedback (arXiv)',
      url: 'https://arxiv.org/abs/2203.02155',
    },
    { label: 'tiktoken, OpenAI\'s tokenizer (GitHub)', url: 'https://github.com/openai/tiktoken' },
    {
      label: 'TechCrunch: ChatGPT reaches 900M weekly active users (Feb 2026)',
      url: 'https://techcrunch.com/2026/02/27/chatgpt-reaches-900m-weekly-active-users/',
    },
    {
      label: 'InfoQ: OpenAI runs ChatGPT on one PostgreSQL primary with read replicas',
      url: 'https://www.infoq.com/news/2026/02/openai-runs-chatgpt-postgres/',
    },
    {
      label: 'Microsoft: The next phase of the Microsoft-OpenAI partnership (2026)',
      url: 'https://blogs.microsoft.com/blog/2026/04/27/the-next-phase-of-the-microsoft-openai-partnership/',
    },
  ],
};
