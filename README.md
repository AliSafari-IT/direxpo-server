# @asafarim/direxpo-server

@asafarim/direxpo-server is a lightweight Node.js + TypeScript server that exposes directory discovery with directory tree generation capabilities and export to md file capabilities over HTTP.

It acts as a backend layer on top of @asafarim/direxpo-core and @asafarim/md-exporter, providing APIs to scan folders, generate structured file trees, and export selected files or directories to Markdown. The package includes a built-in Express dev server for local use, as well as a React-based demo application (Vite) that showcases file discovery, tree generation, and Markdown export in a visual UI. It is designed to be used both as a standalone development tool and as an embeddable service in larger workflows or documentation pipelines.

## Features

- **Express Router**: Ready-to-use API endpoints
- **Tree Integration**: Automatic folder structure generation
- **File Management**: Download and open exported files
- **Tree-Only Export**: Export just the folder structure

## Installation

```bash
pnpm add @asafarim/direxpo-server
```

## Usage

### Basic Setup

```typescript
import express from 'express';
import { createDirexpoRouter } from '@asafarim/direxpo-server';

const app = express();
app.use(express.json());

const { router } = createDirexpoRouter({ outputDir: '.output' });
app.use('/api', router);

app.listen(5199, () => {
  console.log('Server running on http://localhost:5199');
});
```

## API Endpoints

### POST `/api/run`

Export files to markdown.

**Request Body:**
```json
{
  "options": {
    "targetPath": "./src",
    "filter": "tsx",
    "exclude": ["tests"],
    "maxSize": 5,
    "includeTree": true,
    "treeOnly": false
  }
}
```

**Response:**
```json
{
  "outputPath": "/path/to/output.md",
  "report": {
    "included": 42,
    "bytesWritten": 123456
  }
}
```

### POST `/api/discover`

Discover files without exporting.

**Request Body:**
```json
{
  "options": {
    "targetPath": "./src",
    "filter": "tsx"
  }
}
```

**Response:**
```json
{
  "files": ["src/index.ts", "src/app.tsx"]
}
```

### GET `/api/download/:filename`

Download an exported markdown file.

### POST `/api/open-file`

Open an exported file in the default application.

**Request Body:**
```json
{
  "filename": "export_20240106.md"
}
```

## Options

### DirexpoRunOptions

Extends `ExportOptions` from `@asafarim/md-exporter` with:

- `includeTree?: boolean` - Prepend folder structure to export
- `treeOnly?: boolean` - Export only the folder structure
- `filePaths?: string[]` - Pre-discovered file paths

### DirexpoServerOptions

- `outputDir?: string` - Output directory (default: `.output`)

## License

MIT
