import Link from 'next/link'
import { Flower2, Leaf, Palette, Pill, Sparkles, Sun, Waves, Waypoints } from 'lucide-react'

const categories = [
  { name: 'Visage', icon: Sparkles, slug: 'visage' },
  { name: 'Corps', icon: Flower2, slug: 'corps' },
  { name: 'Cheveux', icon: Waves, slug: 'cheveux' },
  { name: 'Levres', icon: Palette, slug: 'levres' },
  { name: 'Yeux', icon: Waypoints, slug: 'yeux' },
  { name: 'Parfums', icon: Pill, slug: 'parfums' },
  { name: 'Solaire', icon: Sun, slug: 'solaire' },
  { name: 'Bio', icon: Leaf, slug: 'bio' },
]

export default function CategoryCircles() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-3xl font-light">
          Nos <span className="text-gradient font-semibold italic">Categories</span>
        </h2>
        <Link href="/products" className="text-sm text-violet-600 hover:text-violet-800 font-medium transition-colors">
          Tout voir
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((cat, i) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="flex flex-col items-center gap-3 flex-shrink-0 group"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-violet-100 to-purple-50 border-2 border-violet-100 group-hover:border-violet-400 group-hover:shadow-lg group-hover:shadow-violet-100 transition-all duration-300 flex items-center justify-center">
                <Icon size={30} className="text-violet-700 sm:w-9 sm:h-9" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-violet-700 transition-colors text-center">
                {cat.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
