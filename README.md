# Shades of You — React (Front End Engineering-II, PBE-2)

## Run
```
npm install
npm run dev      # http://localhost:5173
```
Demo login: demo@shadesofyou.in / demo1234 (or register). Build for deploy: `npm run build` (Vercel/Netlify).

## Where things are
- public/images/*  product + brand photos, public/video.mp4  hero background video
- public/products.json  catalogue (id, cat, price, skin[], concerns[], image) — edit/add products here
- A product whose image file is missing shows a coloured placeholder automatically
- src/components/Sage.jsx  chatbot (rule-based, no API key): asks skin type + concern, recommends products

## Syllabus (lectures 1-72) mapping
- Components/props/lists/conditional rendering: ProductCard, Home, Shop
- Hooks: useState, useEffect, useRef (search focus, chat auto-scroll), useMemo (filter/sort), useCallback (Sage, Modal)
- Custom hooks: useFetch (loading/error/retry), useDebounce
- Router: nested routes (/dashboard), dynamic route (/shop/:id), query params (?cat=), protected route, 404
- Context API: products, cart, auth, bookings, toasts (AppContext)
- Forms + validation: Consult, Contact, Register, Login (reusable Field component)
- UI patterns: modal, tabs, pills, accordion (FAQ), toast, search, sort, pagination
- REST: fetch products.json (loading/error/retry); POST on consult/contact (dummyjson); CRUD on bookings (create in Consult, read/update/delete in Dashboard)
