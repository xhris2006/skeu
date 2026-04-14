'use client'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQty, total } = useCartStore()
  const cartTotal = total()

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={closeCart}
      />

      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col animate-slide-left">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-violet-700" />
            <h2 className="font-display text-xl font-semibold">Mon Panier</h2>
            <span className="ml-1 bg-violet-100 text-violet-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </div>
          <button onClick={closeCart} className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShoppingBag size={48} className="mx-auto mb-3 text-gray-200" />
              <p className="font-medium">Votre panier est vide</p>
              <p className="text-sm mt-1">Decouvrez nos produits</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-gray-50 rounded-2xl p-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || '/placeholder.jpg'}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-violet-700 font-semibold text-sm mt-0.5">
                    {(item.price * item.quantity).toLocaleString()} FCFA
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-violet-400 transition-colors"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-violet-400 transition-colors"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1 text-gray-300 hover:text-red-400 transition-colors self-start"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Sous-total</span>
              <span>{cartTotal.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 mb-4">
              <span>Total</span>
              <span className="text-violet-700">{cartTotal.toLocaleString()} FCFA</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-center block text-sm"
            >
              Passer la commande
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-3 transition-colors"
            >
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </>
  )
}
