'use client'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Beaker, Leaf, Rabbit, Sparkles, Star, Truck } from 'lucide-react'

const trustBadges = [
  { icon: Leaf, label: '100% Naturel' },
  { icon: Rabbit, label: 'Cruelty-Free' },
  { icon: Beaker, label: 'Derma Teste' },
  { icon: Truck, label: 'Livraison rapide' },
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-purple-50 min-h-[90vh] flex items-center">
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 animate-fade-up">
            <Sparkles size={14} />
            Vegan · Cruelty-Free · Naturel
          </div>

          <h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.05] mb-6 animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            Your Skin,
            <br />
            <span className="text-gradient font-semibold italic">Your Glow.</span>
          </h1>

          <p
            className="text-gray-500 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8 animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Des cosmetiques formules avec soin pour sublimer chaque peau. Naturels, ethiques et efficaces, penses pour vous.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up"
            style={{ animationDelay: '0.3s' }}
          >
            <Link href="/products" className="btn-primary inline-flex items-center gap-2 text-sm">
              Explorer la boutique <ArrowRight size={16} />
            </Link>
            <Link href="/products?badge=Best+Seller" className="btn-outline inline-flex items-center gap-2 text-sm">
              <Sparkles size={16} />
              Best Sellers
            </Link>
          </div>

          <div
            className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10 animate-fade-up"
            style={{ animationDelay: '0.4s' }}
          >
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <Icon size={16} className="text-violet-600" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2 flex justify-center animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 animate-float">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-200 to-purple-100 shadow-2xl" />
            <div className="absolute -inset-4 rounded-full border border-violet-200/60" />
            <div className="absolute -inset-8 rounded-full border border-violet-100/40" />

            <div className="absolute inset-6 rounded-full overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/75 backdrop-blur flex items-center justify-center shadow-lg">
                  <Beaker size={42} className="text-violet-700" />
                </div>
                <p className="font-display text-violet-700 text-sm font-semibold italic">Hydrating Serum</p>
                <p className="text-xs text-violet-500 mt-1">12 500 FCFA</p>
              </div>
            </div>

            <div className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-lg px-3 py-2 text-xs font-semibold text-gray-700 animate-pulse-soft inline-flex items-center gap-2">
              <BadgeCheck size={14} className="text-emerald-600" />
              Naturel
            </div>
            <div
              className="absolute -right-6 bottom-1/4 bg-white rounded-2xl shadow-lg px-3 py-2 text-xs font-semibold text-gray-700 animate-pulse-soft inline-flex items-center gap-2"
              style={{ animationDelay: '1s' }}
            >
              <Star size={14} className="text-amber-400 fill-amber-400" />
              4.9/5
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-violet-400 animate-bounce">
        <div className="w-5 h-8 border-2 border-violet-300 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-violet-400 rounded-full" />
        </div>
      </div>
    </section>
  )
}
