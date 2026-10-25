import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useDebounce from '../hooks/useDebounce'
import ProductCard, { ProductImage } from '../components/ProductCard'
import Modal from '../components/Modal'
import Status from '../components/Status'
import { useApp } from '../context/AppContext'
import { CATS, catLabel, inr } from '../utils'

const PER_PAGE = 8

export default function Shop() {
  const { products, loading, error, retry, addToCart } = useApp()
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat') || 'all'
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('default')
  const [page, setPage] = useState(1)
  const [quick, setQuick] = useState(null)
  const dq = useDebounce(q, 300)
  const searchRef = useRef(null)

  useEffect(() => searchRef.current?.focus(), [])
  useEffect(() => setPage(1), [dq, sort, cat])

  const list = useMemo(() => {
    let r = products.filter((p) => (cat === 'all' || p.cat === cat) &&
      `${p.name} ${p.desc}`.toLowerCase().includes(dq.toLowerCase()))
    if (sort === 'asc') r = [...r].sort((a, b) => a.price - b.price)
    if (sort === 'desc') r = [...r].sort((a, b) => b.price - a.price)
    if (sort === 'rating') r = [...r].sort((a, b) => b.rating - a.rating)
    return r
  }, [products, cat, dq, sort])

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE))
  const visible = list.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const closeQuick = useCallback(() => setQuick(null), [])
  const pickCat = (slug) => setParams(slug === 'all' ? {} : { cat: slug })

  return (
    <section className="section">
      <h2>The <em>Collection</em></h2>
      <div className="pills">
        {CATS.map((c) => (
          <button key={c.slug} className={cat === c.slug ? 'pill active' : 'pill'} onClick={() => pickCat(c.slug)}>{c.label}</button>
        ))}
      </div>
      <div className="toolbar">
        <input ref={searchRef} placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="default">Sort: Featured</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>
      <p className="muted count">{list.length} products in {catLabel(cat)}</p>

      <Status loading={loading} error={error} retry={retry} />
      {!loading && !error && list.length === 0 && <p className="status">No products match your search.</p>}
      <div className="grid">
        {visible.map((p) => <ProductCard key={p.id} p={p} onAdd={addToCart} onQuick={setQuick} />)}
      </div>

      {pages > 1 && (
        <div className="pager">
          <button className="btn ghost" disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
          <span>Page {page} of {pages}</span>
          <button className="btn ghost" disabled={page === pages} onClick={() => setPage(page + 1)}>Next →</button>
        </div>
      )}

      <Modal open={!!quick} onClose={closeQuick}>
        {quick && (
          <div className="quick">
            <div className="card-img"><ProductImage p={quick} /></div>
            <div>
              <h3>{quick.name}</h3>
              <p className="muted">{quick.desc}</p>
              <p><strong>{inr(quick.price)}</strong> · ★ {quick.rating}</p>
              <button className="btn" onClick={() => { addToCart(quick); closeQuick() }}>Add to Bag</button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
