import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard, { ProductImage } from '../components/ProductCard'
import Status from '../components/Status'
import { useApp } from '../context/AppContext'
import { catLabel, inr } from '../utils'

export default function ProductDetail() {
  const { id } = useParams()
  const { products, loading, error, retry, addToCart } = useApp()
  const [tab, setTab] = useState('details')
  const p = products.find((x) => x.id === id)

  if (loading || error) return <section className="section"><Status loading={loading} error={error} retry={retry} /></section>
  if (!p) return <section className="section status"><h2>Product not <em>found</em></h2><Link to="/shop" className="btn">Back to shop</Link></section>

  const related = products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4)

  return (
    <section className="section">
      <Link to="/shop" className="muted">← Back to shop</Link>
      <div className="detail">
        <div className="card-img big"><ProductImage p={p} /></div>
        <div>
          <small className="muted">{catLabel(p.cat)}</small>
          <h2>{p.name}</h2>
          <p className="price">{inr(p.price)} <span className="muted">· ★ {p.rating}</span></p>
          <p className="muted">{p.desc}</p>
          <button className="btn" onClick={() => addToCart(p)}>Add to Bag</button>

          <div className="tabs">
            {['details', 'how to use', 'good for'].map((t) => (
              <button key={t} className={tab === t ? 'tab active' : 'tab'} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
          <div className="tab-body">
            {tab === 'details' && <p>{p.desc} Dermatologist tested, cruelty free and made without parabens.</p>}
            {tab === 'how to use' && <p>{p.how || 'Use as directed after cleansing, before moisturiser.'}</p>}
            {tab === 'good for' && (
              <p><strong>Skin types:</strong> {p.skin.join(', ')}<br /><strong>Concerns:</strong> {p.concerns.join(', ')}</p>
            )}
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <>
          <h2 className="mt">You may also <em>like</em></h2>
          <div className="grid">{related.map((r) => <ProductCard key={r.id} p={r} onAdd={addToCart} />)}</div>
        </>
      )}
    </section>
  )
}
