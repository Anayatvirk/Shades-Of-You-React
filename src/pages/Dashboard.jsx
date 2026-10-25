import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'
import { inr } from '../utils'

const SLOTS = ['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '6:00 PM']

// Layout with nested routes (<Outlet />)
export default function Dashboard() {
  return (
    <section className="section">
      <h2>My <em>Dashboard</em></h2>
      <div className="tabs">
        <NavLink to="/dashboard" end className="tab">Overview</NavLink>
        <NavLink to="/dashboard/bookings" className="tab">My bookings</NavLink>
      </div>
      <Outlet />
    </section>
  )
}

export function Overview() {
  const { user, cartCount, cartTotal, bookings } = useApp()
  const mine = bookings.filter((b) => b.email === user.email)
  return (
    <div className="grid3">
      <div className="feature"><h3>Hello, {user.name}</h3><p className="muted">{user.email}</p></div>
      <div className="feature"><h3>{mine.length} booking{mine.length === 1 ? '' : 's'}</h3><p className="muted"><Link to="/dashboard/bookings">Manage consultations →</Link></p></div>
      <div className="feature"><h3>{cartCount} items</h3><p className="muted">In bag · {inr(cartTotal)}</p></div>
    </div>
  )
}

// Read / update / delete bookings
export function Bookings() {
  const { user, bookings, updateBooking, deleteBooking, toast } = useApp()
  const mine = bookings.filter((b) => b.email === user.email)
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState({ date: '', slot: '' })

  const startEdit = (b) => { setEditing(b); setDraft({ date: b.date, slot: b.slot }) }
  const save = () => {
    if (!draft.date || draft.date < new Date().toISOString().split('T')[0]) return toast('Choose a valid future date')
    updateBooking(editing.id, { ...draft, status: 'Rescheduled' })
    setEditing(null)
    toast('Booking rescheduled')
  }
  const cancel = (b) => { deleteBooking(b.id); toast('Booking cancelled') }

  if (mine.length === 0)
    return <div className="status"><p>No bookings yet.</p><Link to="/consult" className="btn">Book a free consultation</Link></div>

  return (
    <>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>ID</th><th>When</th><th>Mode</th><th>Concern</th><th>Status</th><th /></tr></thead>
          <tbody>
            {mine.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td><td>{b.date} · {b.slot}</td><td>{b.mode}</td><td>{b.concern}</td><td>{b.status}</td>
                <td className="actions">
                  <button className="link-btn" onClick={() => startEdit(b)}>Reschedule</button>
                  <button className="link-btn" onClick={() => cancel(b)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)}>
        <h3>Reschedule {editing?.id}</h3>
        <div className="form">
          <label className="field"><span>New date</span>
            <input type="date" min={new Date().toISOString().split('T')[0]} value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
          </label>
          <div className="slots">
            {SLOTS.map((s) => <button key={s} className={draft.slot === s ? 'pill active' : 'pill'} onClick={() => setDraft({ ...draft, slot: s })}>{s}</button>)}
          </div>
          <button className="btn" onClick={save}>Save changes</button>
        </div>
      </Modal>
    </>
  )
}
