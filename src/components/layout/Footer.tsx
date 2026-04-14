import Link from 'next/link'
import { CreditCard, Facebook, Instagram, Linkedin, MessageCircle, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-violet-950 text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-11 h-11 rounded-2xl gradient-brand flex items-center justify-center text-white font-semibold tracking-wide">
              SK
            </span>
            <h2 className="font-display text-3xl font-semibold">skeu</h2>
          </div>
          <p className="text-violet-300 text-sm leading-relaxed">
            Cosmetiques premium formules pour sublimer chaque peau. Vegan, cruelty-free et dermatologiquement testes.
          </p>
          <div className="flex gap-4 mt-6">
            {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-violet-800 hover:bg-violet-600 flex items-center justify-center transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm tracking-widest uppercase text-violet-400 mb-4">Boutique</h3>
          <ul className="space-y-3 text-sm text-violet-200">
            {['Tous les produits', 'Best Sellers', 'Nouveautes', 'Promotions', 'Soins visage', 'Corps et bien-etre'].map((label) => (
              <li key={label}>
                <Link href="/products" className="hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-sm tracking-widest uppercase text-violet-400 mb-4">Aide</h3>
          <ul className="space-y-3 text-sm text-violet-200">
            {['FAQ', 'Livraison', 'Retours', 'Contact', 'A propos'].map((label) => (
              <li key={label}>
                <a href="#" className="hover:text-white transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-sm tracking-widest uppercase text-violet-400 mb-4">Contact</h3>
          <p className="text-violet-200 text-sm mb-4">
            Cameroun
            <br />
            Disponible 7j/7 sur WhatsApp
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '237600000000'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-violet-900 text-center text-violet-400 text-xs py-6">
        <span className="inline-flex items-center gap-2">
          <span>© {new Date().getFullYear()} skeu. Tous droits reserves.</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <CreditCard size={12} />
            Paiement securise via Fapshi
          </span>
        </span>
      </div>
    </footer>
  )
}
