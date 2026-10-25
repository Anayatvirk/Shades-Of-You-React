
import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toast from './components/Toast'
import Sage from './components/Sage'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import About from './pages/About'
import Consult from './pages/Consult'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard, { Overview, Bookings } from './pages/Dashboard'
import NotFound from './pages/NotFound'

export default function App() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/consult" element={<Consult />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="bookings" element={<Bookings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <Sage />
      <Toast />
    </>
  )
}
