# Synapse AI

A minimalist SaaS application featuring an intelligent AI chatbot with RAG (Retrieval-Augmented Generation), built for the Cobalt technical assessment.

**Live Demo:** [https://synapse-ai-nine.vercel.app](https://synapse-ai-nine.vercel.app)

## Features

- **Multi-provider AI Chat** — Switch between GPT-4o and Claude Sonnet 4.5 in real-time
- **Streaming responses** — Real-time token streaming via Vercel AI SDK
- **RAG Pipeline** — Connect Notion & Slack to augment AI responses with your own data
- **File Upload** — Upload PDF and text documents as additional knowledge sources
- **Source Citations** — Every RAG-augmented response includes clickable source references
- **Persistent History** — Conversations and messages stored in PostgreSQL
- **Authentication** — Email/password auth with Better Auth
- **Rate Limiting** — Per-user API rate limiting to prevent abuse
- **Liquid Glass UI** — Glassmorphism design with mesh gradients, backdrop blur, and Framer Motion animations

## Tech Stack & Justifications

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 16 (App Router) | Latest App Router with Server Components, built-in API routes, and native streaming support — ideal for a fullstack AI app |
| Authentication | Better Auth | Lightweight, self-hosted auth with Prisma adapter — no vendor lock-in, full control over user data |
| Database | PostgreSQL (Neon) + Prisma 7 | Neon provides serverless Postgres with pgvector support out of the box. Prisma 7 offers type-safe queries with the new driver adapter pattern |
| Vector Store | pgvector | Keeps embeddings in the same database as application data — simpler architecture, no extra service (vs. Pinecone, Weaviate) |
| AI | Vercel AI SDK + OpenAI + Anthropic | Unified API for multiple providers with built-in streaming. Easy to switch models without changing the UI layer |
| Embeddings | OpenAI text-embedding-3-small | Good balance of cost, speed, and quality at 1536 dimensions |
| UI | Tailwind CSS 4 + shadcn/ui + Framer Motion | Tailwind for rapid styling, shadcn/ui for accessible components (copy-paste, not a dependency), Framer Motion for polished animations |
| Validation | Zod 4 | Runtime validation with TypeScript inference — shared schemas between client and server |
| Testing | Vitest + Testing Library | Fast, ESM-native test runner with HMR. Drop-in Jest compatibility |
| CI/CD | GitHub Actions | Automated lint, type-check, test, and build on every push and PR |

## Architecture

```
src/
├── app/
│   ├── (auth)/              # Sign-in & sign-up pages
│   ├── (dashboard)/         # Protected app pages
│   │   ├── chat/            # Chat interface & conversations
│   │   ├── sources/         # Notion, Slack & file connections
│   │   └── settings/        # User preferences & model selection
│   └── api/
│       ├── auth/            # Better Auth handler
│       ├── chat/            # Streaming chat endpoint
│       ├── conversations/   # CRUD conversations
│       └── sources/         # Notion & Slack OAuth + sync + file upload
├── components/
│   ├── ui/                  # shadcn/ui base components
│   ├── chat/                # Chat input, messages, citations
│   ├── auth/                # Auth forms
│   └── layout/              # Sidebar, glass cards
├── lib/
│   ├── ai/                  # Providers, RAG pipeline, embeddings
│   ├── files/               # PDF & text file parser
│   ├── notion/              # Notion API client
│   ├── slack/               # Slack API client
│   ├── auth.ts              # Better Auth server config
│   ├── auth-client.ts       # Better Auth client
│   ├── db.ts                # Prisma client (adapter pattern)
│   ├── rate-limit.ts        # Per-user rate limiter
│   └── validators.ts        # Zod schemas
├── services/                # Business logic (conversation, message, source)
├── hooks/                   # Custom React hooks
└── types/                   # Shared TypeScript types
```

## RAG Pipeline

```
Connect  →  OAuth Notion/Slack or upload file, store access token / document
Sync     →  Fetch pages/messages, extract text, store as Documents
Chunk    →  Split text (200 words, 50 overlap) with document title prefix
Embed    →  OpenAI text-embedding-3-small → store vectors in pgvector
Retrieve →  Embed user query → cosine similarity top-8 chunks (min score 0.35)
Augment  →  Inject relevant chunks as context in system prompt
Generate →  Stream response with source citations
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database with pgvector extension (recommended: [Neon](https://neon.tech))

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/i9offline/synapse-ai.git
cd synapse-ai
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
```

Fill in your `.env` with:
- `DATABASE_URL` — PostgreSQL connection string
- `BETTER_AUTH_SECRET` — Random secret (min 32 chars)
- `OPENAI_API_KEY` — OpenAI API key
- `ANTHROPIC_API_KEY` — Anthropic API key
- Optionally: Notion and Slack OAuth credentials

4. **Setup the database**

```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests (watch mode) |
| `npm run test:ci` | Run tests (single run) |
| `npm run type-check` | TypeScript type checking |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run Prisma migrations |

## Testing

```bash
# Run all tests
npm run test

# Run tests once (CI mode)
npm run test:ci
```

Tests cover:
- Zod validation schemas (sign-up, sign-in, chat messages, conversations)
- Text chunking logic (splitting, overlap, edge cases)

## Deployment

The application is deployed on Vercel: [https://synapse-ai-nine.vercel.app](https://synapse-ai-nine.vercel.app)

### Deploy your own

1. Push the repository to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy

### Environment Variables for Production

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=<strong-random-secret>
BETTER_AUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## Design

The UI follows a **liquid glass** design system:
- Dark theme with mesh gradient backgrounds (deep blue to violet to black)
- Glassmorphism cards with `backdrop-blur`, semi-transparent borders, and soft shadows
- Smooth animations powered by Framer Motion (page transitions, hover effects, typing indicators)
- Responsive layout with collapsible sidebar
