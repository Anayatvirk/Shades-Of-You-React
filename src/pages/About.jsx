import { Link } from 'react-router-dom'

const values = [
  ['Every shade, every skin', 'We formulate and test across Indian skin tones so no one is an afterthought.'],
  ['Clean, not complicated', 'Short ingredient lists, clear labels and routines you can actually keep up with.'],
  ['Guidance, not guesswork', 'Free consultations and Sage, our chatbot, help you choose with confidence.'],
]

const team = [
  { name: 'Ananya', role: 'Founder & Formulation Lead', img: '/images/ananya.jpg', quote: '“I wanted a brand where you could see yourself on every shelf.”' },
  { name: 'Meena', role: 'Head of Skin Consultations', img: '/images/meena.jpg', quote: '“The best routine is the one that fits your skin and your life.”' },
  { name: 'Rohan', role: 'Product & Customer Care', img: '/images/rohan.jpg', quote: '“Every message from a customer helps us make better skincare.”' },
]

export default function About() {
  return (
    <>
      <section className="section split">
        <div>
          <p className="eyebrow">Our story</p>
          <h2>Skincare that begins with <em>knowing yourself.</em></h2>
          <p className="muted">Shades of You started with a simple frustration: skincare shelves were full of promises, but very few products were made with real, diverse skin in mind. Our founder, Ananya, spent years struggling to find a routine that worked for her own skin, and realised that the answer was never one-size-fits-all.</p>
          <p className="muted">So we built a brand around the idea that skin is personal. Every formula is clean, dermatologist tested and designed to work with your skin rather than against it, from a gentle foam cleanser to a mineral sunscreen that sits light on every tone.</p>
          <p className="muted">Today we pair thoughtful products with real guidance: free expert consultations and Sage, our always-on skincare guide, so you never have to guess what your skin needs.</p>
          <Link to="/shop" className="btn">Explore the range</Link>
        </div>
        <div className="photo"><img src="/images/about.jpeg" alt="Shades of You campaign" /></div>
      </section>

      <section className="section alt">
        <h2>What we <em>believe</em></h2>
        <div className="grid3">
          {values.map(([t, d]) => <div className="feature" key={t}><h3>{t}</h3><p className="muted">{d}</p></div>)}
        </div>
      </section>

      <section className="section">
        <h2>Meet the <em>team</em></h2>
        <div className="grid3">
          {team.map((m) => (
            <div className="member" key={m.name}>
              <div className="photo"><img src={m.img} alt={m.name} /></div>
              <h3>{m.name}</h3>
              <p className="eyebrow">{m.role}</p>
              <p className="muted">{m.quote}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
