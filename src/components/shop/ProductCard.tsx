'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'

interface Product {
  _id:      string
  name:     string
  price:    number
  images:   string[]
  category: string
  badge?:   string
  discount?: number
  rating?:  number
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore()
  const [liked,   setLiked]   = useState(false)
  const [adding,  setAdding]  = useState(false)

  const discountedPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price

  const handleAdd = () => {
    setAdding(true)
    addItem({
      id:    product._id,
      name:  product.name,
      price: discountedPrice,
      image: product.images?.[0] || '/placeholder.jpg',
    })
    setTimeout(() => { setAdding(false); openCart() }, 300)
  }

  const badgeColor: Record<string, string> = {
    'Best Seller': 'bg-amber-500',
    'New':         'bg-green-500',
    '50% OFF':     'bg-red-500',
    'Promo':       'bg-pink-500',
  }

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 card-hover border border-gray-50">
      {/* Image */}
      <div className="relative product-img-wrap bg-violet-50 aspect-square">
        <Link href={`/products/${product._id}`}>
          <Image
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full ${badgeColor[product.badge] || 'bg-violet-600'}`}>
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setLiked(!liked)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all ${
            liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
          }`}
        >
          <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-violet-500 uppercase tracking-wide mb-1">{product.category}</p>
        <Link href={`/products/${product._id}`}>
          <h3 className="font-medium text-gray-800 text-sm leading-tight hover:text-violet-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={11}
              className={i < (product.rating || 4) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
            />
          ))}
        </div>

        {/* Price + Add */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-bold text-violet-700 text-base">
              {discountedPrice.toLocaleString()} FCFA
            </span>
            {product.discount && (
              <span className="ml-2 text-xs text-gray-400 line-through">
                {product.price.toLocaleString()} FCFA
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={adding}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              adding
                ? 'gradient-brand text-white scale-95'
                : 'bg-violet-50 text-violet-700 hover:gradient-brand hover:text-white hover:shadow-lg'
            }`}
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
