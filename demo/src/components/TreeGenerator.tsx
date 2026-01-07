import { useState } from 'react'
import './TreeGenerator.css'

interface TreeOptions {
  targetPath: string
  filter?: 'all' | 'tsx' | 'css' | 'md' | 'json' | 'glob'
  pattern?: string
  exclude?: string
  maxSize?: number
}

function TreeGenerator() {
  const [options, setOptions] = useState<TreeOptions>({
    targetPath: './src',
    filter: 'all',
    pattern: '',
    exclude: '',
    maxSize: undefined,
  })
  const [result, setResult] = useState<{ outputPath: string; report: any } | null>(null)
  const [treeContent, setTreeContent] = useState('')
  const [previewLoading, setPreviewLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTreeContent = async (outputPath: string) => {
    const filename = outputPath.split(/[\\/]/).pop()
    if (!filename) return

    setPreviewLoading(true)
    try {
      const response = await fetch(`/api/download/${filename}`)
      if (!response.ok) {
        throw new Error('Failed to load tree preview')
      }
      const content = await response.text()
      setTreeContent(content)
    } catch (err) {
      setTreeContent('')
      setError(err instanceof Error ? err.message : 'Failed to load tree preview')
    } finally {
      setPreviewLoading(false)
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setTreeContent('')
    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          options: {
            ...options,
            treeOnly: true,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
      if (data.outputPath) {
        await loadTreeContent(data.outputPath)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate tree')
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
      a.download = filename || 'tree.md'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download file')
    }
  }

  return (
    <div className="tree-generator">
      <h2>Tree Generator</h2>
      <p className="description">
        Generate a directory tree structure as markdown without file contents.
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

        <button onClick={handleGenerate} disabled={loading} className="btn-primary">
          {loading ? 'Generating...' : 'Generate Tree'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="results">
          <h3>Tree Generated</h3>
          <div className="result-info">
            <p>
              <strong>Output:</strong> {result.outputPath}
            </p>
            <p>
              <strong>Files Included:</strong> {result.report?.included || 0}
            </p>
            <p>
              <strong>Size:</strong> {result.report?.bytesWritten || 0} bytes
            </p>
          </div>
          <div className="tree-preview-wrapper">
            <div className="preview-header">
              <span>Preview</span>
              {previewLoading && <span className="preview-status">Loading…</span>}
            </div>
            {treeContent ? (
              <pre className="tree-preview">{treeContent}</pre>
            ) : (
              <p className="tree-preview-placeholder">
                {previewLoading ? 'Fetching tree…' : 'Tree content will appear here after generation.'}
              </p>
            )}
          </div>
          <button onClick={handleDownload} className="btn-secondary">
            Download Tree
          </button>
        </div>
      )}
    </div>
  )
}

export default TreeGenerator
