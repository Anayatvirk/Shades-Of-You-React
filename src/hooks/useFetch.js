import { useEffect, useState } from 'react'

// Custom hook: loading + error + retry for any GET request
export default function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tries, setTries] = useState(0)

  useEffect(() => {
    const ctrl = new AbortController()
    setLoading(true)
    setError(null)
    fetch(url, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Request failed (${r.status})`)
        return r.json()
      })
      .then(setData)
      .catch((e) => { if (e.name !== 'AbortError') setError(e.message) })
      .finally(() => { if (!ctrl.signal.aborted) setLoading(false) })
    return () => ctrl.abort()
  }, [url, tries])

  return { data, loading, error, retry: () => setTries((t) => t + 1) }
}
