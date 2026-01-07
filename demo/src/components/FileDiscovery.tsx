import { useState } from 'react'
import './FileDiscovery.css'

interface DiscoverOptions {
  targetPath: string
  pattern?: string
  exclude?: string
  maxSize?: number
}

function FileDiscovery() {
  const [options, setOptions] = useState<DiscoverOptions>({
    targetPath: './src',
    pattern: '',
    exclude: '',
    maxSize: undefined,
  })
  const [files, setFiles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDiscover = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ options }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setFiles(data.files || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to discover files')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="file-discovery">
      <h2>File Discovery</h2>
      <p className="description">
        Discover files in a directory with optional filtering by pattern, exclusions, and size limits.
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
          <label htmlFor="pattern">Pattern (optional)</label>
          <input
            id="pattern"
            type="text"
            value={options.pattern}
            onChange={(e) => setOptions({ ...options, pattern: e.target.value })}
            placeholder="*.ts"
          />
        </div>

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
          <label htmlFor="maxSize">Max Size (bytes, optional)</label>
          <input
            id="maxSize"
            type="number"
            value={options.maxSize || ''}
            onChange={(e) =>
              setOptions({ ...options, maxSize: e.target.value ? Number(e.target.value) : undefined })
            }
            placeholder="100000"
          />
        </div>

        <button onClick={handleDiscover} disabled={loading} className="btn-primary">
          {loading ? 'Discovering...' : 'Discover Files'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {files.length > 0 && (
        <div className="results">
          <h3>Discovered Files ({files.length})</h3>
          <ul className="file-list">
            {files.map((file, idx) => (
              <li key={idx}>{file}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default FileDiscovery
