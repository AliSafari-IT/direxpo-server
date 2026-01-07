import { useState } from 'react'
import FileDiscovery from './components/FileDiscovery'
import TreeGenerator from './components/TreeGenerator'
import MarkdownExporter from './components/MarkdownExporter'
import './App.css'

type Tab = 'discover' | 'tree' | 'export'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('discover')

  return (
    <div className="app">
      <header className="app-header">
        <h1>Direxpo Server Demo</h1>
        <p>Explore use cases for the direxpo-server package</p>
      </header>

      <nav className="tab-nav">
        <button
          className={activeTab === 'discover' ? 'active' : ''}
          onClick={() => setActiveTab('discover')}
        >
          File Discovery
        </button>
        <button
          className={activeTab === 'tree' ? 'active' : ''}
          onClick={() => setActiveTab('tree')}
        >
          Tree Generator
        </button>
        <button
          className={activeTab === 'export' ? 'active' : ''}
          onClick={() => setActiveTab('export')}
        >
          Markdown Export
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'discover' && <FileDiscovery />}
        {activeTab === 'tree' && <TreeGenerator />}
        {activeTab === 'export' && <MarkdownExporter />}
      </main>
    </div>
  )
}

export default App
