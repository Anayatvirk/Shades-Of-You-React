import { useState } from 'react'
import { Link } from 'react-router-dom'
import Field from '../components/Field'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'
import { API, CONCERNS, SKINS } from '../utils'

const SLOTS = ['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '6:00 PM']
const today = () => new Date().toISOString().split('T')[0]

const validate = (f) => {
  const e = {}
  if (f.name.trim().length < 3) e.name = 'Please enter your full name'
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email address'
  if (!/^[6-9]\d{9}$/.test(f.phone)) e.phone = 'Enter a valid 10-digit mobile number'
  if (!f.date) e.date = 'Choose a date'
  else if (f.date < today()) e.date = 'Date cannot be in the past'
  if (!f.slot) e.slot = 'Pick a time slot'
  return e
}

export default function Consult() {
  const { user, addBooking, toast } = useApp()
  const empty = { name: user?.name || '', email: user?.email || '', phone: '', skin: 'Oily', concern: 'Acne', mode: 'Video call', date: '', slot: '', notes: '' }
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(null)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSending(true)
    const booking = { ...form, id: 'SOY-' + Math.floor(1000 + Math.random() * 9000), status: 'Confirmed' }
    try { // REST call (simulated by dummyjson); the booking is saved locally either way
      await fetch(`${API}/posts/add`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: `Consultation ${booking.id}`, userId: 1 }) })
    } catch { /* offline: still saved locally */ }
    addBooking(booking)
    setSending(false)
    setDone(booking)
    setForm(empty)
    toast('Consultation booked!')
  }

  return (
    <section className="section narrow-lg">
      <p className="eyebrow">Free · 20 minutes</p>
      <h2>Book a <em>consultation</em></h2>
      <p className="muted">Talk to a skin expert about your routine, concerns and goals. Pick a time that suits you.</p>
      <form className="form" onSubmit={submit} noValidate>
        <div className="two">
          <Field label="Full name" name="name" value={form.name} onChange={onChange} error={errors.name} />
          <Field label="Email" type="email" name="email" value={form.email} onChange={onChange} error={errors.email} />
        </div>
        <div className="two">
          <Field label="Mobile number" name="phone" inputMode="numeric" maxLength={10} value={form.phone} onChange={onChange} error={errors.phone} />
          <Field label="Consultation mode" as="select" name="mode" value={form.mode} onChange={onChange}>
            {['Video call', 'Phone call', 'Chat'].map((m) => <option key={m}>{m}</option>)}
          </Field>
        </div>
        <div className="two">
          <Field label="Skin type" as="select" name="skin" value={form.skin} onChange={onChange}>{SKINS.map((s) => <option key={s}>{s}</option>)}</Field>
          <Field label="Main concern" as="select" name="concern" value={form.concern} onChange={onChange}>{CONCERNS.map((s) => <option key={s}>{s}</option>)}</Field>
        </div>
        <Field label="Preferred date" type="date" name="date" min={today()} value={form.date} onChange={onChange} error={errors.date} />
        <div>
          <span className="label">Time slot</span>
          <div className="slots">
            {SLOTS.map((s) => (
              <button type="button" key={s} className={form.slot === s ? 'pill active' : 'pill'} onClick={() => setForm({ ...form, slot: s })}>{s}</button>
            ))}
          </div>
          {errors.slot && <small className="err">{errors.slot}</small>}
        </div>
        <Field label="Anything else we should know? (optional)" as="textarea" rows={3} name="notes" value={form.notes} onChange={onChange} />
        <button className="btn full" disabled={sending}>{sending ? 'Booking…' : 'Confirm booking'}</button>
      </form>

      <Modal open={!!done} onClose={() => setDone(null)}>
        {done && (
          <div className="success">
            <span className="icon">🎉</span>
            <h3>You're booked, {done.name.split(' ')[0]}!</h3>
            <p className="muted">Booking ID <strong>{done.id}</strong><br />{done.date} at {done.slot} · {done.mode}</p>
            <p className="muted">We'll send the details to {done.email}.</p>
            <div className="row center">
              {user ? <Link to="/dashboard/bookings" className="btn">View my bookings</Link> : <Link to="/register" className="btn">Create an account to manage it</Link>}
              <button className="btn ghost" onClick={() => setDone(null)}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
