export const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')
export const API = 'https://dummyjson.com' // used to simulate form submissions (POST)

export const CATS = [
  { slug: 'all', label: 'All' },
  { slug: 'spf', label: 'SPF' },
  { slug: 'moisturiser', label: 'Moisturiser' },
  { slug: 'serum', label: 'Serum' },
  { slug: 'cleanser', label: 'Cleanser' },
  { slug: 'toner', label: 'Toner' },
  { slug: 'lip-balm', label: 'Lip Balm' },
  { slug: 'mask', label: 'Mask' },
  { slug: 'scrub', label: 'Scrub' },
  { slug: 'tools', label: 'Tools' },
]
export const catLabel = (slug) => CATS.find((c) => c.slug === slug)?.label || slug
export const SKINS = ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal']
export const CONCERNS = ['Acne', 'Dullness', 'Pigmentation', 'Fine lines', 'Dryness', 'Sensitivity', 'Sun protection']
