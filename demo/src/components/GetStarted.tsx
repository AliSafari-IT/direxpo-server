import './GetStarted.css'

function GetStarted() {
  return (
    <div className="get-started">
      <h2>Get Started</h2>
      
      <section className="intro-section">
        <h3>Welcome to Direxpo Server</h3>
        <p>
          Direxpo Server is a powerful tool for discovering, analyzing, and exporting files from your local file system. 
          This guide will help you get started with the package and understand how to use it in your projects.
        </p>
        <div className="note" style={{ marginTop: '1rem' }}>
          <strong>⚠️ Important:</strong> This demo app requires a backend server to be running. If you see 404 errors or "Failed to load resource" messages, 
          it means the backend server is not running. Follow the steps below to set up your local server.
        </div>
      </section>

      <section className="section">
        <h3>Quick Start: Set Up Your Local Server (5 minutes)</h3>
        <p>Follow these steps to get the backend server running on your machine:</p>
        
        <div className="step-guide">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Create a new Node.js project</h4>
              <pre className="code-block">
{`mkdir my-direxpo-server
cd my-direxpo-server
npm init -y`}
              </pre>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Install dependencies</h4>
              <pre className="code-block">
{`npm install @asafarim/direxpo-server express
# or if using pnpm:
pnpm add @asafarim/direxpo-server express`}
              </pre>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Create a server file (server.js)</h4>
              <pre className="code-block">
{`import express from 'express';
import { createDirexpoRouter } from '@asafarim/direxpo-server';

const app = express();
const PORT = 5199;

// Create the direxpo router
const { router, outputDir } = createDirexpoRouter({
  outputDir: './exports'
});

// Mount the router at /api
app.use('/api', router);

// Start the server
app.listen(PORT, () => {
  console.log(\`✅ Server running at http://localhost:\${PORT}\`);
  console.log(\`📁 Exports will be saved to: \${outputDir}\`);
});`}
              </pre>
            </div>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>Update package.json to use ES modules</h4>
              <p>Add this line to your package.json:</p>
              <pre className="code-block">
{`{
  "type": "module",
  ...
}`}
              </pre>
            </div>
          </div>

          <div className="step">
            <div className="step-number">5</div>
            <div className="step-content">
              <h4>Start the server</h4>
              <pre className="code-block">
{`node server.js`}
              </pre>
              <p>You should see: <code>✅ Server running at http://localhost:5199</code></p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">6</div>
            <div className="step-content">
              <h4>Test the server</h4>
              <p>Open a new terminal and test the API:</p>
              <pre className="code-block">
{`curl -X POST http://localhost:5199/api/discover \\
  -H "Content-Type: application/json" \\
  -d '{"options":{"targetPath":"./"}}'`}
              </pre>
            </div>
          </div>
        </div>

        <div className="info" style={{ marginTop: '1.5rem' }}>
          <strong>✅ Server is ready!</strong> Now you can use this demo app. The demo will communicate with your local server at <code>http://localhost:5199</code>.
        </div>
      </section>

      <section className="section">
        <h3>Installation</h3>
        <p>Install the package via npm or pnpm:</p>
        <pre className="code-block">
{`npm install @asafarim/direxpo-server
# or
pnpm add @asafarim/direxpo-server`}
        </pre>
      </section>

      <section className="section">
        <h3>Basic Usage</h3>
        <p>Import and create a router in your Express server:</p>
        <p className="note"><strong>Note:</strong> Make sure to install express as well:</p>
        <pre className="code-block">
{`npm install express
# or
pnpm add express`}
        </pre>
        <div className="note">
          <strong>Note:</strong> The express package is a peer dependency and must be installed separately.
        </div>
        <div>
          Then you can use the package in your Express server like this:
        </div>
        <pre className="code-block">
{`import express from 'express';
import { createDirexpoRouter } from '@asafarim/direxpo-server';

const app = express();
const { router, outputDir } = createDirexpoRouter({
  outputDir: './exports'
});

app.use('/api', router);
app.listen(5199, () => {
  console.log('Server running on http://localhost:5199');
});`}
        </pre>

        <div className="info">
          After starting the server, you can access the API at <code>http://localhost:5199/api</code>.
        </div>
        <div className="heading-point-to-center">
          OR
        </div>
        <div className="tip">
          Use the provieded demo app to use the package for file discovery, directory tree generation, and export folder contents by 
          git cloning the repository and running the demo app. Get repo from <a href="https://github.com/AliSafari-IT/direxpo-server" target="_blank" rel="noopener noreferrer">here</a>.
        </div>
      </section>

      <section className="section">
        <h3 className="section-title">Available Endpoints</h3>
        <div className="endpoints-list">
          <div className="endpoint">
            <h4>POST /api/discover</h4>
            <p>Discover files in a directory with optional filtering.</p>
            <p className="endpoint-example">
              <strong>Request:</strong>
              <br />
              <code>{`{ options: { targetPath: './src', filter: 'tsx', exclude: 'node_modules' } }`}</code>
            </p>
          </div>

          <div className="endpoint">
            <h4>POST /api/run</h4>
            <p>Generate markdown export with optional tree prepending.</p>
            <p className="endpoint-example">
              <strong>Request:</strong>
              <br />
              <code>{`{ options: { targetPath: './src', treeOnly: false, includeTree: true } }`}</code>
            </p>
          </div>

          <div className="endpoint">
            <h4>GET /api/download/:filename</h4>
            <p>Download a generated markdown file.</p>
          </div>

          <div className="endpoint">
            <h4>POST /api/open-file</h4>
            <p>Open a generated file in the default system application.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h3>Filter Options</h3>
        <p>Use the filter parameter to narrow down file discovery:</p>
        <ul className="filter-list">
          <li><strong>all</strong> - Include all files</li>
          <li><strong>tsx</strong> - TypeScript and JavaScript files</li>
          <li><strong>css</strong> - CSS stylesheets</li>
          <li><strong>md</strong> - Markdown files</li>
          <li><strong>json</strong> - JSON files</li>
          <li><strong>glob</strong> - Use glob patterns for custom filtering</li>
        </ul>
      </section>

      <section className="section">
        <h3>Advanced Options</h3>
        <div className="options-table">
          <div className="option-row">
            <div className="option-name">pattern</div>
            <div className="option-desc">Glob pattern for file matching (requires filter: "glob")</div>
            <div className="option-example">*.ts, src/**/*.tsx</div>
          </div>
          <div className="option-row">
            <div className="option-name">exclude</div>
            <div className="option-desc">Comma-separated or array of patterns to exclude</div>
            <div className="option-example">node_modules,dist,.git</div>
          </div>
          <div className="option-row">
            <div className="option-name">maxSize</div>
            <div className="option-desc">Maximum file size in MB</div>
            <div className="option-example">10</div>
          </div>
          <div className="option-row">
            <div className="option-name">includeTree</div>
            <div className="option-desc">Prepend directory tree to markdown export</div>
            <div className="option-example">true / false</div>
          </div>
          <div className="option-row">
            <div className="option-name">treeOnly</div>
            <div className="option-desc">Generate only the directory tree without file contents</div>
            <div className="option-example">true / false</div>
          </div>
        </div>
      </section>

      <section className="section">
        <h3>Use Cases</h3>
        <div className="use-cases">
          <div className="use-case">
            <h4>📁 File Discovery</h4>
            <p>Quickly discover and list files in your project with flexible filtering options. Perfect for analyzing project structure.</p>
          </div>
          <div className="use-case">
            <h4>🌳 Directory Tree Generation</h4>
            <p>Generate a visual directory tree structure as markdown. Useful for documentation and project overviews.</p>
          </div>
          <div className="use-case">
            <h4>📄 Markdown Export</h4>
            <p>Export source code files to a single markdown document with optional tree prepending. Great for code reviews and documentation.</p>
          </div>
          <div className="use-case">
            <h4>🔍 Smart Filtering</h4>
            <p>Filter by file type or use glob patterns to target specific files. Exclude unwanted directories like node_modules automatically.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h3>Example Workflow</h3>
        <ol className="workflow-steps">
          <li>
            <strong>Step 1: Discover Files</strong>
            <p>Use the File Discovery tab to explore files in your target directory with filters.</p>
          </li>
          <li>
            <strong>Step 2: Generate Tree</strong>
            <p>Use the Tree Generator to create a visual directory structure for documentation.</p>
          </li>
          <li>
            <strong>Step 3: Export to Markdown</strong>
            <p>Use the Markdown Exporter to combine files into a single document with optional tree prepending.</p>
          </li>
          <li>
            <strong>Step 4: Download or Open</strong>
            <p>Download the generated file or open it directly in your default application.</p>
          </li>
        </ol>
      </section>

      <section className="section">
        <h3>Tips & Best Practices</h3>
        <ul className="tips-list">
          <li>Always exclude <code>node_modules</code> and <code>dist</code> directories to improve performance</li>
          <li>Use glob patterns for precise file targeting (e.g., <code>src/**/*.test.ts</code>)</li>
          <li>Set reasonable max size limits to avoid including large binary files</li>
          <li>Use the tree-only option for quick project structure documentation</li>
          <li>Include the tree in markdown exports for better file context</li>
        </ul>
      </section>

      <section className="section">
        <h3>Need Help?</h3>
        <p>
          For more information, visit the{' '}
          <a href="https://github.com/AliSafari-IT/direxpo-server" target="_blank" rel="noopener noreferrer">
            GitHub repository
          </a>
          {' '}or check the package documentation.
        </p>
      </section>
    </div>
  )
}

export default GetStarted
