import Link from 'next/link'
import { ArrowRight, Beaker, HeartHandshake } from 'lucide-react'

export default function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-8 min-h-[180px] flex flex-col justify-between">
          <Beaker size={96} className="absolute right-4 bottom-4 opacity-20 text-white select-none" />
          <div>
            <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">Offre limitee</p>
            <h3 className="text-white font-display text-4xl sm:text-5xl font-bold leading-none">
              50%
              <br />
              <span className="text-3xl sm:text-4xl">OFF</span>
            </h3>
            <p className="text-white/90 text-sm mt-2">Soins du visage selectionnes</p>
          </div>
          <Link
            href="/products?badge=50%25+OFF"
            className="self-start mt-4 bg-white text-orange-600 text-xs font-bold px-5 py-2 rounded-full hover:shadow-lg transition-shadow inline-flex items-center gap-2"
          >
            Acheter maintenant <ArrowRight size={14} />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-purple-800 p-8 min-h-[180px] flex flex-col justify-between">
          <HeartHandshake size={96} className="absolute right-4 bottom-4 opacity-20 text-white select-none" />
          <div>
            <p className="text-violet-200 text-xs font-semibold uppercase tracking-widest mb-1">Collection</p>
            <h3 className="text-white font-display text-3xl sm:text-4xl font-bold leading-tight">
              Clean Vegan
              <br />
              Powerful
            </h3>
            <p className="text-violet-200 text-sm mt-2">Beaute consciente et efficace</p>
          </div>
          <Link
            href="/products"
            className="self-start mt-4 bg-white text-violet-700 text-xs font-bold px-5 py-2 rounded-full hover:shadow-lg transition-shadow inline-flex items-center gap-2"
          >
            Decouvrir <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
