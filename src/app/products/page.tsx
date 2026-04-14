'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import CartSidebar from '@/components/shop/CartSidebar'
import ProductCard from '@/components/shop/ProductCard'
import { Loader2, SlidersHorizontal } from 'lucide-react'

interface Product {
  _id: string
  name: string
  price: number
  images: string[]
  category: string
  badge?: string
  discount?: number
  rating?: number
}

const CATEGORIES = ['Tous', 'Visage', 'Corps', 'Cheveux', 'Levres', 'Yeux', 'Parfums', 'Solaire', 'Bio']
const SORT_OPTIONS = [
  { label: 'Popularite', value: 'popular' },
  { label: 'Prix croissant', value: 'price_asc' },
  { label: 'Prix decroissant', value: 'price_desc' },
  { label: 'Nouveautes', value: 'newest' },
]

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('Tous')
  const [sort, setSort] = useState('popular')
  const [search, setSearch] = useState(searchParams.get('q') || '')

  useEffect(() => {
    const currentQuery = searchParams.get('q') || ''
    const badge = searchParams.get('badge')

    setSearch(currentQuery)
    setLoading(true)

    const params = new URLSearchParams()
    if (category !== 'Tous') params.set('category', category.toLowerCase())
    if (badge) params.set('badge', badge)
    if (currentQuery) params.set('q', currentQuery)
    params.set('sort', sort)
    params.set('limit', '20')

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [category, sort, searchParams])

  return (
    <>
      <Navbar />
      <CartSidebar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 md:pb-10">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-light mb-1">
            Notre <span className="text-gradient font-semibold italic">Boutique</span>
          </h1>
          <p className="text-gray-400 text-sm">{products.length} produits disponibles</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 max-w-xl">
            <SlidersHorizontal size={16} className="text-violet-500" />
            <input
              value={search}
              readOnly
              placeholder="Utilisez la recherche dans la barre du haut"
              className="w-full bg-transparent text-sm text-gray-700 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? 'gradient-brand text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-violet-50 hover:text-violet-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-gray-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-violet-400"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-3xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="font-medium">Aucun produit trouve</p>
            <p className="text-sm mt-1">Essayez une autre categorie ou une autre recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}

function ProductsFallback() {
  return (
    <>
      <Navbar />
      <CartSidebar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 md:pb-10">
        <div className="flex items-center justify-center py-24 text-violet-600">
          <Loader2 size={28} className="animate-spin" />
        </div>
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsContent />
    </Suspense>
  )
}
