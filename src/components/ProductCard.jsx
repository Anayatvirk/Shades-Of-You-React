import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { catLabel, inr } from '../utils'

// Image with graceful fallback: if the file is missing, a coloured placeholder is shown
export function ProductImage({ p }) {
  const [failed, setFailed] = useState(false)
  if (failed || !p.image) return <div className={`ph ph-${p.cat}`}><span>{catLabel(p.cat)}</span></div>
  return <img src={p.image} alt={p.name} loading="lazy" onError={() => setFailed(true)} />
}

function ProductCard({ p, onAdd, onQuick }) {
  return (
    <div className="card">
      <Link to={`/shop/${p.id}`}><div className="card-img"><ProductImage p={p} /></div></Link>
      <div className="card-body">
        <small className="muted">{catLabel(p.cat)}</small>
        <h3>{p.name}</h3>
        <p className="muted">★ {p.rating} · <strong>{inr(p.price)}</strong></p>
        <div className="row">
          <button className="btn" onClick={() => onAdd(p)}>Add to Bag</button>
          {onQuick && <button className="btn ghost" onClick={() => onQuick(p)}>Quick view</button>}
        </div>
      </div>
    </div>
  )
}
export default memo(ProductCard)
