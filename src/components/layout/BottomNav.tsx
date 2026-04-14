'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

const navItems = [
  { icon: Home,        label: 'Accueil',  href: '/' },
  { icon: Search,      label: 'Chercher', href: '/products' },
  { icon: ShoppingBag, label: 'Panier',   href: null },
  { icon: Heart,       label: 'Favoris',  href: '/wishlist' },
  { icon: User,        label: 'Compte',   href: '/account' },
]

export default function BottomNav() {
  const pathname    = usePathname()
  const { itemCount, toggleCart } = useCartStore()
  const count = itemCount()

  // Hide on admin and checkout pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/checkout')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-100 pb-safe md:hidden shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(item => {
          const isCart   = item.href === null
          const isActive = !isCart && pathname === item.href
          const Icon     = item.icon

          if (isCart) {
            return (
              <button
                key="cart"
                onClick={toggleCart}
                className="relative flex flex-col items-center gap-0.5 px-3 py-2"
              >
                <div className="relative w-11 h-11 gradient-brand rounded-full flex items-center justify-center shadow-lg shadow-violet-200">
                  <Icon size={20} className="text-white" />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </div>
              </button>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 transition-colors ${
                isActive ? 'text-violet-700' : 'text-gray-400'
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-1 h-1 bg-violet-600 rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
