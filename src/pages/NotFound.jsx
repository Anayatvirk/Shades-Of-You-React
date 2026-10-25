import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section status">
      <h1 className="big404">404</h1>
      <h2>This page is <em>not found</em></h2>
      <Link to="/" className="btn">Back to home</Link>
    </section>
  )
}
