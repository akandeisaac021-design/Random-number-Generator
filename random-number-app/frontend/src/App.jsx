import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL

function App() {
  const [page, setPage] = useState('number') // 'number' | 'choice'

  return (
    <div className="page">
      <div className="card">
        <div className="nav-tabs">
          <button
            className={page === 'number' ? 'nav-tab active' : 'nav-tab'}
            onClick={() => setPage('number')}
          >
            Number
          </button>
          <button
            className={page === 'choice' ? 'nav-tab active' : 'nav-tab'}
            onClick={() => setPage('choice')}
          >
            Choice
          </button>
        </div>

        {page === 'number' ? <NumberPage /> : <ChoicePage />}
      </div>
    </div>
  )
}

function NumberPage() {
  const [number, setNumber] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [minValue, setMinValue] = useState(1)
  const [maxValue, setMaxValue] = useState(100)

  const handleGenerateNumber = async () => {
    setLoading(true)
    setError(null)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000) // Render free-tier cold starts can take a while

    try {
      const response = await fetch(`${API_BASE}/api/${minValue}/${maxValue}`, {
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        setError(`Server error (status ${response.status}). Please try again.`)
        return
      }

      const data = await response.json()
      setNumber(data.number)
    } catch (err) {
      clearTimeout(timeoutId)

      if (err.name === 'AbortError') {
        setError('The server is waking up from idle — this can take up to 20 seconds on the first request. Please try again.')
      } else if (!navigator.onLine) {
        setError('You appear to be offline. Check your internet connection.')
      } else {
        setError('Could not reach the backend. It may be down or unreachable.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1>Random Number Generator</h1>
      <p className="subtitle">Click the button to fetch a random number from the backend.</p>

      <div className="result">
        {number !== null ? number : '—'}
      </div>

      <div className="input-group">
        <label htmlFor="minValue">Min value:</label>
        <input
          id="minValue"
          type="text"
          inputMode="numeric"
          value={minValue}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^-\d]/g, '').replace(/(?!^)-/g, '')
            setMinValue(raw === '' || raw === '-' ? raw : Number(raw))
          }}
        />
      </div>

      <div className="input-group">
        <label htmlFor="maxValue">Max value:</label>
        <input
          id="maxValue"
          type="text"
          inputMode="numeric"
          value={maxValue}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^-\d]/g, '').replace(/(?!^)-/g, '')
            setMaxValue(raw === '' || raw === '-' ? raw : Number(raw))
          }}
        />
      </div>

      <button onClick={handleGenerateNumber} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {error && <p className="error">{error}</p>}
    </>
  )
}

function ChoicePage() {
  const [choices, setChoices] = useState('')
  const [choiceResult, setChoiceResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerateChoice = async () => {
    setLoading(true)
    setError(null)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000)

    try {
      const response = await fetch(
        `${API_BASE}/api/choice?options=${encodeURIComponent(choices)}`,
        { signal: controller.signal }
      )
      clearTimeout(timeoutId)

      if (!response.ok) {
        setError(`Server error (status ${response.status}). Please try again.`)
        return
      }

      const data = await response.json()
      setChoiceResult(data.choice)
    } catch (err) {
      clearTimeout(timeoutId)

      if (err.name === 'AbortError') {
        setError('The server is waking up from idle — this can take up to 20 seconds on the first request. Please try again.')
      } else if (!navigator.onLine) {
        setError('You appear to be offline. Check your internet connection.')
      } else {
        setError('Could not reach the backend. It may be down or unreachable.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1>Random Choice Picker</h1>
      <p className="subtitle">Type a comma-separated list and let the backend pick one.</p>

      <div className="result">
        {choiceResult !== null ? choiceResult : '—'}
      </div>

      <div className="input-group">
        <label htmlFor="choices">Choices:</label>
        <input
          id="choices"
          type="text"
          placeholder="pizza, tacos, sushi"
          value={choices}
          onChange={(e) => setChoices(e.target.value)}
        />
      </div>

      <button onClick={handleGenerateChoice} disabled={loading || !choices.trim()}>
        {loading ? 'Picking...' : 'Pick One'}
      </button>

      {error && <p className="error">{error}</p>}
    </>
  )
}

export default App
