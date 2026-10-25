import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Field from '../components/Field'
import { useApp } from '../context/AppContext'

const validate = (f) => {
  const e = {}
  if (f.name.trim().length < 3) e.name = 'Name must be at least 3 characters'
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email address'
  if (!/^(?=.*\d).{8,}$/.test(f.password)) e.password = 'Minimum 8 characters, including a number'
  if (f.confirm !== f.password) e.confirm = 'Passwords do not match'
  if (!f.terms) e.terms = 'Please accept the terms to continue'
  return e
}

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', skin: 'Oily', terms: false })
  const [errors, setErrors] = useState({})
  const { login, toast } = useApp()
  const navigate = useNavigate()

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }
  const submit = (e) => {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length) return
    const accounts = JSON.parse(localStorage.getItem('vs_accounts') || '[]')
    if (accounts.some((a) => a.email === form.email)) return setErrors({ email: 'This email is already registered' })
    accounts.push({ name: form.name, email: form.email, password: form.password, skin: form.skin })
    localStorage.setItem('vs_accounts', JSON.stringify(accounts))
    toast('Account created!')
    login({ name: form.name, email: form.email, skin: form.skin })
    navigate('/dashboard')
  }

  return (
    <section className="section narrow">
      <h2>Join <em>Shades of You</em></h2>
      <form className="form" onSubmit={submit} noValidate>
        <Field label="Full name" name="name" value={form.name} onChange={onChange} error={errors.name} />
        <Field label="Email" type="email" name="email" value={form.email} onChange={onChange} error={errors.email} />
        <Field label="Password" type="password" name="password" value={form.password} onChange={onChange} error={errors.password} />
        <Field label="Confirm password" type="password" name="confirm" value={form.confirm} onChange={onChange} error={errors.confirm} />
        <label className="field">
          <span>Skin type</span>
          <select name="skin" value={form.skin} onChange={onChange}>
            {['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'].map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="check"><input type="checkbox" name="terms" checked={form.terms} onChange={onChange} /> I agree to the terms & privacy policy</label>
        {errors.terms && <small className="err">{errors.terms}</small>}
        <button className="btn full">Create account</button>
        <p className="muted">Already a member? <Link to="/login">Login</Link></p>
      </form>
    </section>
  )
}
