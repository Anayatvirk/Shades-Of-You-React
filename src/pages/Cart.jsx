import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { inr } from '../utils'

export default function Cart() {
  const { cart, cartTotal, changeQty, removeItem, clearCart, toast } = useApp()
  const shipping = cartTotal > 2500 ? 0 : 99
  const checkout = () => { toast('Order placed! Thank you 🌿'); clearCart() }

  if (cart.length === 0)
    return <section className="section status"><h2>Your bag is <em>empty</em></h2><Link to="/shop" className="btn">Start shopping</Link></section>

  return (
    <section className="section">
      <h2>Your <em>Bag</em></h2>
      <div className="cart">
        <div>
          {cart.map((i) => (
            <div className="cart-item" key={i.id}>
              <img src={i.image} alt={i.name} onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} />
              <div className="grow"><h3>{i.name}</h3><p className="muted">{inr(i.price)}</p></div>
              <div className="qty">
                <button onClick={() => changeQty(i.id, -1)}>−</button><span>{i.qty}</span><button onClick={() => changeQty(i.id, 1)}>+</button>
              </div>
              <strong>{inr(i.price * i.qty)}</strong>
              <button className="link-btn" onClick={() => removeItem(i.id)}>Remove</button>
            </div>
          ))}
        </div>
        <aside className="summary">
          <h3>Summary</h3>
          <p className="between"><span>Subtotal</span><span>{inr(cartTotal)}</span></p>
          <p className="between"><span>Shipping</span><span>{shipping ? inr(shipping) : 'Free'}</span></p>
          <p className="between total"><span>Total</span><span>{inr(cartTotal + shipping)}</span></p>
          <small className="muted">Free shipping above ₹2,500</small>
          <button className="btn full" onClick={checkout}>Checkout</button>
        </aside>
      </div>
    </section>
  )
}
