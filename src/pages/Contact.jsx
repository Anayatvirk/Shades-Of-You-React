import { useState } from 'react'
import Field from '../components/Field'
import { useApp } from '../context/AppContext'
import { API } from '../utils'

const ISSUES = ['Order or delivery issue', 'Product advice', 'Skin reaction', 'Returns & refunds', 'Payment problem', 'Something else']
const FAQ = [
  ['How long does delivery take?', 'Orders arrive in 3-5 working days across India. Shipping is free above ₹2,500.'],
  ['Can I return a product?', 'Yes, unopened products can be returned within 7 days. Contact us with your order number.'],
  ['My skin reacted to a product. What now?', 'Stop using it, rinse with cool water and write to us here. For anything severe, please see a doctor.'],
  ['Are your products suitable for sensitive skin?', 'Many are. Ask Sage or book a free consultation and we will suggest the gentlest options.'],
]

const validate = (f) => {
  const e = {}
  if (f.name.trim().length < 3) e.name = 'Please enter your name'
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email address'
  if (f.message.trim().length < 10) e.message = 'Please describe the issue (at least 10 characters)'
  return e
}

export default function Contact() {
  const { user, toast } = useApp()
  const empty = { name: user?.name || '', email: user?.email || '', issue: ISSUES[0], order: '', message: '' }
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [open, setOpen] = useState(0)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSending(true)
    try {
      await fetch(`${API}/posts/add`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: form.issue, body: form.message, userId: 1 }) })
    } catch { /* offline */ }
    const saved = JSON.parse(localStorage.getItem('sy_messages') || '[]')
    localStorage.setItem('sy_messages', JSON.stringify([{ ...form, at: new Date().toISOString() }, ...saved]))
    setSending(false)
    setForm(empty)
    toast("Message sent. We'll reply within 24 hours.")
  }

  return (
    <section className="section">
      <p className="eyebrow">We're here to help</p>
      <h2>Get in <em>touch</em></h2>
      <div className="split top">
        <form className="form" onSubmit={submit} noValidate>
          <div className="two">
            <Field label="Your name" name="name" value={form.name} onChange={onChange} error={errors.name} />
            <Field label="Email" type="email" name="email" value={form.email} onChange={onChange} error={errors.email} />
          </div>
          <div className="two">
            <Field label="What is this about?" as="select" name="issue" value={form.issue} onChange={onChange}>{ISSUES.map((i) => <option key={i}>{i}</option>)}</Field>
            <Field label="Order number (optional)" name="order" value={form.order} onChange={onChange} />
          </div>
          <Field label="Tell us what's happening" as="textarea" rows={6} name="message" value={form.message} onChange={onChange} error={errors.message} />
          <button className="btn full" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</button>
        </form>

        <div>
          <div className="feature">
            <h3>Reach us directly</h3>
            <p className="muted">✉️ hello@shadesofyou.in<br />📞 +91 98765 43210<br />🕘 Mon–Sat, 10 AM – 7 PM</p>
          </div>
          <h3 className="mt-sm">Quick answers</h3>
          {FAQ.map(([q, a], i) => (
            <div className="faq" key={q}>
              <button onClick={() => setOpen(open === i ? -1 : i)}>{q}<span>{open === i ? '−' : '+'}</span></button>
              {open === i && <p className="muted">{a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
