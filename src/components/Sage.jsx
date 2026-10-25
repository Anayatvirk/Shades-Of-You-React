import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { CONCERNS, SKINS, catLabel, inr } from '../utils'

// keyword -> skin type / concern, so customers can type naturally
const SKIN_WORDS = {
  Oily: ['oily', 'greasy', 'shiny'], Combination: ['combination', 'combo'],
  Sensitive: ['sensitive', 'reactive', 'irritat'], Normal: ['normal'],
}
const CONCERN_WORDS = {
  Acne: ['acne', 'pimple', 'breakout', 'blemish', 'zit'], Dullness: ['dull', 'glow', 'tired', 'bright'],
  Pigmentation: ['pigment', 'dark spot', 'tanning', 'marks', 'melasma'], 'Fine lines': ['fine line', 'wrinkle', 'ageing', 'aging'],
  Dryness: ['dehydrat', 'hydrat', 'dryness', 'flak'], Sensitivity: ['redness', 'rosacea', 'sensitivity'],
  'Sun protection': ['sun', 'spf'],
}
const detect = (text, map) => Object.keys(map).find((k) => map[k].some((w) => text.includes(w)))
const detectSkin = (t) => detect(t, SKIN_WORDS) || (/\bdry\b|\btight\b/.test(t) ? 'Dry' : undefined)

export default function Sage() {
  const { products, addToCart } = useApp()
  const [open, setOpen] = useState(false)
  const [typing, setTyping] = useState(false)
  const [msgs, setMsgs] = useState([
    { from: 'bot', text: "Hi, I'm Sage 🌿 your skincare guide. Tell me your skin type and main concern and I'll pick products for you.", chips: SKINS },
  ])
  const profile = useRef({ skin: null, concern: null })
  const bottom = useRef(null)

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing, open])

  const recommend = useCallback(() => {
    const { skin, concern } = profile.current
    const scored = products
      .map((p) => ({ p, score: (p.skin.includes(skin) ? 2 : 0) + (p.concerns.includes(concern) ? 3 : 0) }))
      .filter((x) => x.score >= 3)
      .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating)
    const seen = new Set()
    return scored.filter((x) => !seen.has(x.p.cat) && seen.add(x.p.cat)).slice(0, 3).map((x) => x.p)
  }, [products])

  const respond = useCallback((raw) => {
    const t = ` ${raw.toLowerCase()}`
    const skin = detectSkin(t)
    const concern = detect(t, CONCERN_WORDS)
    if (skin) profile.current.skin = skin
    if (concern) profile.current.concern = concern
    const { skin: s, concern: c } = profile.current

    if (/consult|book|appointment|expert/.test(t)) return { text: 'Our skin experts offer a free consultation. You can pick a date and time on the booking page.', link: ['/consult', 'Book a consultation'] }
    if (/ship|deliver|delivery/.test(t)) return { text: 'We ship across India in 3-5 working days. Shipping is free above ₹2,500, otherwise ₹99.' }
    if (/return|refund/.test(t)) return { text: 'Unopened products can be returned within 7 days. Write to us on the Contact page and we will sort it out.', link: ['/contact', 'Contact us'] }
    if (/price|cost|cheap|budget/.test(t)) return { text: 'Our range starts at ₹399 for sheet masks and goes up to ₹2,199 for the night cream. Tell me your skin type and I will fit something to it.' }
    if (/^\s*(hi|hello|hey)\b/.test(t)) return { text: 'Hello! What is your skin type?', chips: SKINS }

    if (s && c) {
      const recs = recommend()
      if (recs.length) return { text: `For ${s.toLowerCase()} skin with ${c.toLowerCase()}, here is what I would start with:`, products: recs, chips: ['Start over'] }
      return { text: 'I could not find a perfect match, but our team can build a routine for you.', link: ['/consult', 'Book a consultation'] }
    }
    if (s) return { text: `Got it, ${s.toLowerCase()} skin. What is your main concern?`, chips: CONCERNS }
    if (c) return { text: `Noted, ${c.toLowerCase()}. And what is your skin type?`, chips: SKINS }
    return { text: 'I can recommend products if you tell me your skin type (oily, dry, combination, sensitive, normal) and your main concern.', chips: SKINS }
  }, [recommend])

  const send = useCallback((text) => {
    const msg = text.trim()
    if (!msg) return
    if (msg === 'Start over') profile.current = { skin: null, concern: null }
    setMsgs((m) => [...m, { from: 'user', text: msg }])
    setTyping(true)
    setTimeout(() => {
      const r = msg === 'Start over' ? { text: 'Fresh start! What is your skin type?', chips: SKINS } : respond(msg)
      setMsgs((m) => [...m, { from: 'bot', ...r }])
      setTyping(false)
    }, 600)
  }, [respond])

  const [input, setInput] = useState('')
  const submit = (e) => { e.preventDefault(); send(input); setInput('') }

  return (
    <>
      <button className="sage-fab" onClick={() => setOpen(!open)} aria-label="Chat with Sage">{open ? '✕' : '💬 Sage'}</button>
      {open && (
        <div className="sage">
          <div className="sage-head"><strong>Sage</strong><small>Your skincare guide</small></div>
          <div className="sage-body">
            {msgs.map((m, i) => (
              <div key={i} className={`bubble ${m.from}`}>
                <p>{m.text}</p>
                {m.products?.map((p) => (
                  <div className="mini" key={p.id}>
                    <img src={p.image} alt="" onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} />
                    <div>
                      <Link to={`/shop/${p.id}`} onClick={() => setOpen(false)}><strong>{p.name}</strong></Link>
                      <small>{catLabel(p.cat)} · {inr(p.price)}</small>
                      <button className="btn sm" onClick={() => addToCart(p)}>Add to Bag</button>
                    </div>
                  </div>
                ))}
                {m.link && <Link className="btn sm" to={m.link[0]} onClick={() => setOpen(false)}>{m.link[1]}</Link>}
                {m.chips && i === msgs.length - 1 && (
                  <div className="chips">{m.chips.map((c) => <button key={c} onClick={() => send(c)}>{c}</button>)}</div>
                )}
              </div>
            ))}
            {typing && <div className="bubble bot"><p className="dots">Sage is typing…</p></div>}
            <div ref={bottom} />
          </div>
          <form className="sage-input" onSubmit={submit}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. oily skin with acne" />
            <button className="btn sm">Send</button>
          </form>
        </div>
      )}
    </>
  )
}
