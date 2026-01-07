import { useState } from 'react'
import './MarkdownExporter.css'

interface ExportOptions {
  targetPath: string
  filter?: 'all' | 'tsx' | 'css' | 'md' | 'json' | 'glob'
  pattern?: string
  exclude?: string
  maxSize?: number
  includeTree?: boolean
}

function MarkdownExporter() {
  const [options, setOptions] = useState<ExportOptions>({
    targetPath: './src',
    filter: 'all',
    pattern: '',
    exclude: '',
    maxSize: undefined,
    includeTree: false,
  })
  const [result, setResult] = useState<{ outputPath: string; report: any } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ options }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!result?.outputPath) return

    const filename = result.outputPath.split(/[\\/]/).pop()
    try {
      const response = await fetch(`/api/download/${filename}`)
      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || 'export.md'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download file')
    }
  }

  const handleOpenFile = async () => {
    if (!result?.outputPath) return

    const filename = result.outputPath.split(/[\\/]/).pop()
    try {
      const response = await fetch('/api/open-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      })

      if (!response.ok) throw new Error('Failed to open file')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open file')
    }
  }

  return (
    <div className="markdown-exporter">
      <h2>Markdown Exporter</h2>
      <p className="description">
        Export files to a single markdown document with optional directory tree prepended.
      </p>

      <div className="form">
        <div className="form-group">
          <label htmlFor="targetPath">Target Path</label>
          <input
            id="targetPath"
            type="text"
            value={options.targetPath}
            onChange={(e) => setOptions({ ...options, targetPath: e.target.value })}
            placeholder="./src"
          />
        </div>

        <div className="form-group">
          <label htmlFor="filter">Filter</label>
          <select
            id="filter"
            value={options.filter || 'all'}
            onChange={(e) => setOptions({ ...options, filter: e.target.value as any })}
          >
            <option value="all">All Files</option>
            <option value="tsx">TypeScript/JavaScript</option>
            <option value="css">CSS</option>
            <option value="md">Markdown</option>
            <option value="json">JSON</option>
            <option value="glob">Glob Pattern</option>
          </select>
        </div>

        {options.filter === 'glob' && (
          <div className="form-group">
            <label htmlFor="pattern">Pattern</label>
            <input
              id="pattern"
              type="text"
              value={options.pattern || ''}
              onChange={(e) => setOptions({ ...options, pattern: e.target.value })}
              placeholder="*.ts"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="exclude">Exclude (optional)</label>
          <input
            id="exclude"
            type="text"
            value={options.exclude}
            onChange={(e) => setOptions({ ...options, exclude: e.target.value })}
            placeholder="node_modules,dist"
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxSize">Max Size (MB, optional)</label>
          <input
            id="maxSize"
            type="number"
            value={options.maxSize || ''}
            onChange={(e) =>
              setOptions({ ...options, maxSize: e.target.value ? Number(e.target.value) : undefined })
            }
            placeholder="10"
          />
        </div>

        <div className="form-group-checkbox">
          <input
            id="includeTree"
            type="checkbox"
            checked={options.includeTree}
            onChange={(e) => setOptions({ ...options, includeTree: e.target.checked })}
          />
          <label htmlFor="includeTree">Include directory tree</label>
        </div>

        <button onClick={handleExport} disabled={loading} className="btn-primary">
          {loading ? 'Exporting...' : 'Export to Markdown'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="results">
          <h3>Export Complete</h3>
          <div className="result-info">
            <p>
              <strong>Output:</strong> {result.outputPath}
            </p>
            {result.report && (
              <>
                <p>
                  <strong>Total Matched:</strong> {result.report.counts?.totalMatched ?? 0}
                </p>
                <p>
                  <strong>Files Included:</strong> {result.report.counts?.included ?? 0}
                </p>
                <p>
                  <strong>Skipped (binary/large/error):</strong>{' '}
                  {(result.report.counts?.skippedBinary ?? 0) +
                    (result.report.counts?.skippedLarge ?? 0) +
                    (result.report.counts?.skippedError ?? 0)}
                </p>
                <p>
                  <strong>Bytes Written:</strong> {result.report.bytesWritten ?? 0}
                </p>
              </>
            )}
          </div>
          <div className="action-buttons">
            <button onClick={handleDownload} className="btn-secondary">
              Download
            </button>
            <button onClick={handleOpenFile} className="btn-secondary">
              Open File
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MarkdownExporter
