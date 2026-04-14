'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  BadgeCheck,
  Heart,
  Leaf,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
  X,
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

const navLinks = [
  { label: 'Boutique', href: '/products' },
  { label: 'Nouveautes', href: '/products?badge=New' },
  { label: 'Promotions', href: '/products?badge=50%25+OFF' },
  { label: 'Best Sellers', href: '/products?badge=Best+Seller' },
  { label: 'Compte', href: '/account' },
]

const topHighlights = [
  { icon: Leaf, label: 'Vegan' },
  { icon: ShieldCheck, label: 'Cruelty-Free' },
  { icon: BadgeCheck, label: 'Dermatologiquement teste' },
  { icon: Truck, label: 'Livraison rapide au Cameroun' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { itemCount, toggleCart } = useCartStore()
  const count = itemCount()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const submitSearch = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) {
      router.push('/products')
      setSearchOpen(false)
      return
    }
    router.push(`/products?q=${encodeURIComponent(trimmed)}`)
    setSearchOpen(false)
    setMenuOpen(false)
  }

  return (
    <>
      <div className="gradient-brand text-white text-center text-[11px] sm:text-xs py-2 px-4 font-body tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          {topHighlights.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5">
              <Icon size={12} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 text-gray-700 hover:text-violet-700 transition-colors"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>

            <Link href="/" className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-2xl gradient-brand flex items-center justify-center text-white font-semibold tracking-wide shadow-md shadow-violet-200">
                SK
              </span>
              <span className="font-display text-2xl font-semibold text-gradient tracking-wide">skeu</span>
            </Link>
          </div>

          <ul className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-violet-700 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                submitSearch(query)
              }}
              className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-2 min-w-[270px]"
            >
              <Search size={16} className="text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full bg-transparent text-sm outline-none text-gray-700"
              />
            </form>
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="Rechercher"
              onClick={() => setSearchOpen((prev) => !prev)}
              className="p-2 text-gray-500 hover:text-violet-700 transition-colors lg:hidden"
            >
              <Search size={20} />
            </button>
            <Link href="/wishlist" aria-label="Favoris" className="p-2 text-gray-500 hover:text-violet-700 transition-colors hidden sm:block">
              <Heart size={20} />
            </Link>
            <Link href="/account" aria-label="Compte" className="p-2 text-gray-500 hover:text-violet-700 transition-colors hidden sm:block">
              <User size={20} />
            </Link>
            <button
              aria-label="Panier"
              onClick={toggleCart}
              className="relative p-2 text-gray-700 hover:text-violet-700 transition-colors"
            >
              <ShoppingBag size={22} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 gradient-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </nav>

        {searchOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-3 lg:hidden">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                submitSearch(query)
              }}
              className="max-w-7xl mx-auto flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-2"
            >
              <Search size={16} className="text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full bg-transparent text-sm outline-none text-gray-700"
              />
              <button type="submit" className="text-violet-700 text-sm font-medium">
                OK
              </button>
            </form>
          </div>
        )}
      </header>

      {menuOpen && (
        <>
          <button
            aria-label="Fermer le menu"
            className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[60]"
            onClick={() => setMenuOpen(false)}
          />

          <aside className="fixed top-0 left-0 h-full w-[86vw] max-w-sm bg-white shadow-2xl z-[70] flex flex-col animate-slide-right">
            <div className="flex items-center justify-between px-5 py-5 border-b border-violet-100">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-white font-semibold tracking-wide">
                  SK
                </span>
                <div>
                  <p className="font-display text-2xl font-semibold text-gradient">skeu</p>
                  <p className="text-xs text-gray-400 mt-1">Navigation</p>
                </div>
              </div>
              <button
                className="p-2 text-gray-500 hover:text-violet-700 transition-colors"
                onClick={() => setMenuOpen(false)}
                aria-label="Fermer le menu"
              >
                <X size={22} />
              </button>
            </div>

            <div className="px-5 py-5 border-b border-violet-50">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  submitSearch(query)
                }}
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-2"
              >
                <Search size={16} className="text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full bg-transparent text-sm outline-none text-gray-700"
                />
              </form>
            </div>

            <div className="px-5 py-6 border-b border-violet-50">
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                {topHighlights.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 rounded-2xl bg-violet-50 px-3 py-3">
                    <Icon size={16} className="text-violet-700" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <nav className="flex-1 px-5 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-4 text-base font-medium border-b border-gray-100 last:border-0 ${
                    pathname === link.href ? 'text-violet-700' : 'text-gray-700 hover:text-violet-700'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  )
}
