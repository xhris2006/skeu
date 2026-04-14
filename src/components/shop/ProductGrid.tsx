'use client'
import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import Link from 'next/link'

interface Product {
  _id: string; name: string; price: number; images: string[]
  category: string; badge?: string; discount?: number; rating?: number
}

interface Props {
  title:      string
  subtitle?:  string
  query?:     string   // e.g. "?featured=true" or "?badge=Best+Seller"
  viewAllHref?: string
  maxItems?:  number
}

export default function ProductGrid({ title, subtitle, query = '', viewAllHref, maxItems = 8 }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    fetch(`/api/products${query}&limit=${maxItems}`)
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [query, maxItems])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl font-light">
            {title.split(' ').map((word, i) =>
              i === 0
                ? <span key={i} className="text-gradient font-semibold italic">{word} </span>
                : <span key={i}>{word} </span>
            )}
          </h2>
          {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm text-violet-600 hover:text-violet-800 font-medium transition-colors flex-shrink-0">
            Voir tout →
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(maxItems > 4 ? 4 : maxItems)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-3xl aspect-[3/4] animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>Aucun produit trouvé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map(p => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </section>
  )
}
