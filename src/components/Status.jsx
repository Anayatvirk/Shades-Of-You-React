// Reusable loading / error UI for API calls
export default function Status({ loading, error, retry }) {
  if (loading) return <div className="status"><div className="spinner" /><p>Loading…</p></div>
  if (error) return (
    <div className="status">
      <p>Something went wrong: {error}</p>
      <button className="btn" onClick={retry}>Try again</button>
    </div>
  )
  return null
}
