import { Link } from 'react-router-dom'
import ProductCard, { ProductImage } from '../components/ProductCard'
import Status from '../components/Status'
import { useApp } from '../context/AppContext'
import { CATS } from '../utils'

const claims = ['Dermatologist tested', 'Cruelty free', 'Made for Indian skin', 'Fragrance light', 'Vegan formulas', 'Free consultation']
const features = [
  ['🌿', 'Clean formulas', 'No parabens, sulphates or mineral oil. Ever.'],
  ['🧪', 'Science-backed', 'Actives like niacinamide, AHA and peptides at skin-friendly strengths.'],
  ['💬', 'Guided by Sage', 'Tell our chatbot your skin type and concern for instant product picks.'],
]

export default function Home() {
  const { products, loading, error, retry, addToCart } = useApp()
  const best = products.filter((p) => p.best).slice(0, 4)
  const cats = CATS.filter((c) => c.slug !== 'all').map((c) => ({ ...c, sample: products.find((p) => p.cat === c.slug) }))

  return (
    <>
      <section className="hero">
        <video className="hero-video" autoPlay muted loop playsInline preload="auto" poster="/images/background.jpeg">
            <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow light">Clean skincare, every shade</p>
          <h1>Skin that feels <em>like you.</em></h1>
          <p className="lead">Thoughtful formulas for every skin type, with expert guidance one tap away.</p>
          <div className="row center">
            <Link to="/shop" className="btn">Shop the range</Link>
            <Link to="/consult" className="btn ghost light">Free consultation</Link>
          </div>
        </div>
      </section>

      <div className="marquee"><div className="marquee-track">
        {[...claims, ...claims].map((c, i) => <span key={i}>{c} ✦</span>)}
      </div></div>

      <section className="section">
        <h2>Shop by <em>category</em></h2>
        <Status loading={loading} error={error} retry={retry} />
        <div className="cat-grid">
          {cats.map((c) => (
            <Link key={c.slug} to={`/shop?cat=${c.slug}`} className="cat-tile">
              <div className="cat-img">{c.sample && <ProductImage p={c.sample} />}</div>
              <span>{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section alt">
        <h2>Bestsellers</h2>
        <div className="grid">
          {best.map((p) => <ProductCard key={p.id} p={p} onAdd={addToCart} />)}
        </div>
        <div className="row center"><Link to="/shop" className="btn ghost">View all products →</Link></div>
      </section>

      <section className="section">
        <div className="grid3">
          {features.map(([icon, t, d]) => (
            <div className="feature" key={t}><span className="icon">{icon}</span><h3>{t}</h3><p className="muted">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="band">
        <h2>Not sure where to <em>start?</em></h2>
        <p>Book a free 20-minute consultation with our skin experts, or chat with Sage right now.</p>
        <Link to="/consult" className="btn light">Book a consultation</Link>
      </section>
    </>
  )
}
