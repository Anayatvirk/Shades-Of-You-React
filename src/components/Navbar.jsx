import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { cartCount, user, logout } = useApp()
  const close = () => setOpen(false)

  return (
    <nav className="nav">
      <Link to="/" className="logo" onClick={close}>Shades of <em>You</em></Link>
      <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">{open ? '✕' : '☰'}</button>
      <ul className={open ? 'nav-links open' : 'nav-links'}>
        <li><NavLink to="/" end onClick={close}>Home</NavLink></li>
        <li><NavLink to="/shop" onClick={close}>Shop</NavLink></li>
        <li><NavLink to="/about" onClick={close}>About</NavLink></li>
        <li><NavLink to="/consult" onClick={close}>Consult</NavLink></li>
        <li><NavLink to="/contact" onClick={close}>Contact</NavLink></li>
        {user && <li><NavLink to="/dashboard" onClick={close}>Dashboard</NavLink></li>}
        <li><NavLink to="/cart" onClick={close}>Bag <span className="badge">{cartCount}</span></NavLink></li>
        {user
          ? <li><button className="link-btn" onClick={() => { logout(); close() }}>Logout</button></li>
          : <li><NavLink to="/login" onClick={close}>Login</NavLink></li>}
      </ul>
    </nav>
  )
}
