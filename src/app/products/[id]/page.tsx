'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import CartSidebar from '@/components/shop/CartSidebar'
import { useCartStore } from '@/store/cartStore'
import { ShoppingBag, Heart, Star, ChevronLeft, Plus, Minus } from 'lucide-react'
import Link from 'next/link'

interface Product {
  _id: string; name: string; description: string; price: number
  images: string[]; category: string; badge?: string; discount?: number; stock: number
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product,  setProduct]  = useState<Product | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [imgIdx,   setImgIdx]   = useState(0)
  const [qty,      setQty]      = useState(1)
  const [liked,    setLiked]    = useState(false)
  const { addItem, openCart }   = useCartStore()

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(d => { setProduct(d.product); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <><Navbar /><div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" /></div></>
  )

  if (!product) return (
    <><Navbar /><div className="min-h-screen flex items-center justify-center text-gray-400"><p>Produit introuvable.</p></div></>
  )

  const finalPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product._id, name: product.name, price: finalPrice, image: product.images?.[0] || '' })
    }
    openCart()
  }

  return (
    <>
      <Navbar />
      <CartSidebar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-10">
        {/* Back */}
        <Link href="/products" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-violet-700 transition-colors mb-6">
          <ChevronLeft size={16} /> Retour
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-violet-50 mb-4">
              <Image
                src={product.images?.[imgIdx] || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {product.badge}
                </span>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-violet-500' : 'border-transparent'}`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-violet-500 text-xs uppercase tracking-widest font-medium mb-2">{product.category}</p>
            <h1 className="font-display text-3xl sm:text-4xl font-light leading-tight mb-3">{product.name}</h1>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs text-gray-400">(4.9) · 128 avis</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-violet-700">{finalPrice.toLocaleString()} FCFA</span>
              {product.discount && (
                <>
                  <span className="ml-3 text-gray-400 line-through text-lg">{product.price.toLocaleString()} FCFA</span>
                  <span className="ml-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">-{product.discount}%</span>
                </>
              )}
            </div>

            <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Stock */}
            <p className={`text-xs font-medium mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `✅ En stock (${product.stock} disponibles)` : '❌ Rupture de stock'}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-gray-600 font-medium">Quantité</span>
              <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors">
                  <Minus size={14} />
                </button>
                <span className="font-semibold w-6 text-center">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button onClick={handleAdd} disabled={product.stock === 0}
                className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <ShoppingBag size={16} /> Ajouter au panier
              </button>
              <button onClick={() => setLiked(!liked)}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${liked ? 'border-red-300 text-red-500 bg-red-50' : 'border-gray-200 text-gray-400 hover:border-violet-300'}`}>
                <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Trust */}
            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              {[['🚚','Livraison rapide'],['🔒','Paiement sécurisé'],['✅','100% Naturel']].map(([icon, label]) => (
                <div key={label} className="bg-gray-50 rounded-2xl py-3 px-2">
                  <div className="text-xl mb-1">{icon}</div>
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
