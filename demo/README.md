# Direxpo Server Demo

A React TypeScript demo application showcasing the `@asafarim/direxpo-server` package capabilities.

## Features

This demo includes three main use cases:

### 1. File Discovery

Discover files in a directory with optional filtering:

- Pattern matching (e.g., `*.ts`, `*.js`)
- Exclusion patterns (e.g., `node_modules,dist`)
- File size limits

### 2. Tree Generator

Generate directory tree structures as markdown:

- Visual representation of folder hierarchy
- Filtered by patterns and exclusions
- Standalone tree output without file contents

### 3. Markdown Exporter

Export files to a single markdown document:

- Combine multiple files into one markdown file
- Optional directory tree prepended
- Download or open exported files

## Prerequisites

- Node.js 18+ and pnpm
- A running `direxpo-server` backend on port 4000

## Setup

1. Install dependencies:

```bash
cd demo
pnpm install
```

1. Start the backend server (from parent directory):

```bash
cd ..
pnpm dev
```

1. Start the demo app (in a separate terminal):

```bash
cd demo
pnpm dev
```

1. Open <http://localhost:3000> in your browser

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: CSS with design tokens from `@asafarim/shared-tokens`
- **API Proxy**: Vite dev server proxies `/api` to `http://localhost:4000`

## API Endpoints Used

- `POST /api/discover` - Discover files in a directory
- `POST /api/run` - Generate tree or export markdown
- `GET /api/download/:filename` - Download generated files
- `POST /api/open-file` - Open file in system default app

## Development

```bash
pnpm dev      # Start dev server
pnpm build    # Build for production
pnpm preview  # Preview production build
```

## Notes

- TypeScript errors about missing modules will resolve after running `pnpm install`
- The backend server must be running for API calls to work
- All styling uses design tokens from `@asafarim/shared-tokens`
