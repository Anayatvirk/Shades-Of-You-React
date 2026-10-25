import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <p className="logo">Shades of <em>You</em></p>
      <p>Clean skincare for every shade, every skin.</p>
      <div className="foot-links">
        <Link to="/shop">Shop</Link><Link to="/about">Our story</Link><Link to="/consult">Free consultation</Link><Link to="/contact">Contact</Link>
      </div>
      <small>© 2026 Shades of You · hello@shadesofyou.in</small>
    </footer>
  )
}
