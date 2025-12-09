import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import LoginPage from "./pages/LoginPage";
import MainPage from './pages/MainPage';
/*import DataviewPage from "./pages/DataviewPage";*/
/*import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";
import StatisticsPage from "./pages/StatisticsPage";*/


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
        <Link to="/help" style={{ marginRight: '1rem' }}><img className='fragezeichen' src="src/bilder/fragezeichen.svg" ></img></Link>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        {/*<Link to="/about" style={{ marginRight: '1rem' }}>About</Link>
        <Link to="/api-test" style={{ marginRight: '1rem' }}>API Test</Link>*/}
        <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
        <Link to="/main" style={{ marginRight: '1rem' }}>Hauptansicht</Link>
        <Link to="/settings"><button style={{"font-size":20, "padding":"0.2em 0.5em"}}>⚙</button></Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        {/*<Route path="/about" element={<AboutPage />} />
        <Route path="/api-test" element={<ApiTestPage />} />*/}
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/main" element={<MainPage/>}/>
      </Routes>
    </div>
  )
}

export default App