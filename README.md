# @asafarim/direxpo-server

Express API wrapper for MD Exporter with tree generation capabilities.

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
