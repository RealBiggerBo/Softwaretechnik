import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'

function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <p>Willkommen auf der Startseite.</p>
    </div>
  )
}

function AboutPage() {
  return (
    <div>
      <h1>About</h1>
      <p>Dies ist eine Beispielseite.</p>
    </div>
  )
}

function ApiTestPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/hello/')
        if (!response.ok) {
          throw new Error(`HTTP-Error: ${response.status}`)
        }
        const json = await response.json()
        setData(json)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <h1>API Test</h1>
      {loading && <p>Lade...</p>}
      {error && <p style={{ color: 'red' }}>Fehler: {error}</p>}
      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  )
}

function App() {
  return (
    <div>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/about" style={{ marginRight: '1rem' }}>About</Link>
        <Link to="/api-test">API Test</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/api-test" element={<ApiTestPage />} />
      </Routes>
    </div>
  )
}

export default App