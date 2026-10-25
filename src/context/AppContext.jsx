import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch'

const Ctx = createContext()
export const useApp = () => useContext(Ctx)

const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

export function AppProvider({ children }) {
  // product catalogue is fetched once (public/products.json) and shared with every page + the Sage chatbot
  const { data, loading, error, retry } = useFetch('/products.json')
  const products = data || []

  const [cart, setCart] = useState(() => load('sy_cart', []))
  const [user, setUser] = useState(() => load('sy_user', null))
  const [bookings, setBookings] = useState(() => load('sy_bookings', []))
  const [toasts, setToasts] = useState([])

  useEffect(() => localStorage.setItem('sy_cart', JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem('sy_user', JSON.stringify(user)), [user])
  useEffect(() => localStorage.setItem('sy_bookings', JSON.stringify(bookings)), [bookings])

  const toast = useCallback((msg) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, msg }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2500)
  }, [])

  const addToCart = useCallback((p) => {
    setCart((c) => {
      const found = c.find((i) => i.id === p.id)
      if (found) return c.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
      return [...c, { id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 }]
    })
    toast(`${p.name} added to bag`)
  }, [toast])

  const changeQty = (id, d) =>
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: i.qty + d } : i)).filter((i) => i.qty > 0))
  const removeItem = (id) => setCart((c) => c.filter((i) => i.id !== id))
  const clearCart = () => setCart([])

  const login = (u) => { setUser(u); toast(`Welcome, ${u.name}`) }
  const logout = () => { setUser(null); toast('Logged out') }

  // bookings: create / update / delete
  const addBooking = (b) => setBookings((list) => [b, ...list])
  const updateBooking = (id, changes) => setBookings((list) => list.map((b) => (b.id === id ? { ...b, ...changes } : b)))
  const deleteBooking = (id) => setBookings((list) => list.filter((b) => b.id !== id))

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.qty * i.price, 0)

  return (
    <Ctx.Provider value={{
      products, loading, error, retry,
      cart, cartCount, cartTotal, addToCart, changeQty, removeItem, clearCart,
      user, login, logout, bookings, addBooking, updateBooking, deleteBooking, toast, toasts,
    }}>
      {children}
    </Ctx.Provider>
  )
}
