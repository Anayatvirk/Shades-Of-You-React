import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Field from '../components/Field'
import { useApp } from '../context/AppContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const accounts = JSON.parse(localStorage.getItem('vs_accounts') || '[]')
    const demo = { name: 'Demo User', email: 'demo@shadesofyou.in', password: 'demo1234' }
    const found = [demo, ...accounts].find((a) => a.email === form.email && a.password === form.password)
    if (!found) return setError('Incorrect email or password')
    login({ name: found.name, email: found.email, skin: found.skin })
    navigate(location.state?.from || '/dashboard', { replace: true })
  }

  return (
    <section className="section narrow">
      <h2>Welcome <em>back</em></h2>
      <form className="form" onSubmit={submit}>
        <Field label="Email" type="email" name="email" value={form.email} onChange={onChange} required />
        <Field label="Password" type="password" name="password" value={form.password} onChange={onChange} required />
        {error && <small className="err">{error}</small>}
        <button className="btn full">Login</button>
        <p className="muted">Demo: demo@shadesofyou.in / demo1234</p>
        <p className="muted">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </section>
  )
}
