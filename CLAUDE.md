# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check

# Database
npx prisma migrate dev    # Apply migrations
npx prisma studio         # Open Prisma Studio GUI

# Testing
npm run test         # Run all tests (Vitest)
npm run test -- path/to/test.ts  # Run single test file
```

## Environment

Copy `.env.example` or create `.env` with:
- `ANTHROPIC_API_KEY` — falls back to `MockLanguageModel` if absent (good for testing)
- `OPENAI_API_KEY` — alternative provider (OpenAI gpt-4o-mini)
- `JWT_SECRET` — optional, has dev default

## Architecture

**UIGen** is an AI-powered React component generator with a browser-based IDE layout.

### Data Flow

```
User message → useAIChat hook → POST /api/chat → streamText (Vercel AI SDK)
  → LLM with tool calls (str_replace_editor, file_manager)
  → FileSystemContext.handleToolCall() updates VirtualFileSystem
  → Preview/Editor re-render via refreshTrigger
  → On finish: project + messages saved to SQLite via Prisma
```

### Key Abstractions

**VirtualFileSystem** (`src/lib/file-system.ts`) — in-memory file tree, never touches disk. Serialized to JSON for DB storage. The AI tools operate on this FS. Exported singleton `fileSystem` used throughout.

**Language Model Provider** (`src/lib/provider.ts`) — `getLanguageModel()` returns OpenAI (if key present) or `MockLanguageModel`. The mock generates realistic multi-step tool calls for testing without an API key.

**JSX Transformer** (`src/lib/transform/jsx-transformer.ts`) — generates self-contained HTML with Babel standalone + import maps for in-browser preview. The preview runs in a sandboxed `<iframe>`.

**Chat Context** (`src/lib/contexts/chat-context.tsx`) — wraps Vercel AI SDK's `useChat()`, handles anonymous work tracking, delegates tool calls to FileSystemContext.

**File System Context** (`src/lib/contexts/file-system-context.tsx`) — manages VirtualFileSystem state, handles AI tool call results (create/update/delete files), triggers preview/editor refreshes.

### System Prompt

`src/lib/prompts/generation.tsx` — instructs the AI to:
- Use `/App.jsx` as the component entry point
- Use `@/` import alias for internal files
- Style with Tailwind CSS only (no HTML files)

### Auth

JWT sessions via HTTP-only cookies (7-day expiry), `jose` library, bcrypt hashing. Middleware at `src/middleware.ts` verifies tokens on protected routes. Projects support both anonymous and authenticated users (nullable `userId`).

### Database Schema

Two models in SQLite (Prisma):
- `User`: email + hashed password
- `Project`: name, optional userId, `messages` (JSON string), `data` (JSON string of serialized VirtualFileSystem)

### UI Layout

`src/app/main-content.tsx` — resizable panels: 35% chat | 65% preview+code. Code view splits into FileTree (30%) + Monaco editor (70%). Shadcn/ui components, Tailwind CSS v4.
