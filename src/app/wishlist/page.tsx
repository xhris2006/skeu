import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import CartSidebar from '@/components/shop/CartSidebar'
import Link from 'next/link'

export default function WishlistPage() {
  return (
    <>
      <Navbar />
      <CartSidebar />
      <main className="min-h-screen flex flex-col items-center justify-center text-center p-4 pb-28 md:pb-4">
        <div className="text-6xl mb-4">💜</div>
        <h1 className="font-display text-3xl font-light mb-2">Mes Favoris</h1>
        <p className="text-gray-400 text-sm mb-6">
          Vous n'avez pas encore de favoris. Explorez nos produits !
        </p>
        <Link href="/products" className="btn-primary text-sm inline-block">
          Découvrir la boutique ✨
        </Link>
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
