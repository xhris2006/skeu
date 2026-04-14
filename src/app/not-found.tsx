import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-light flex flex-col items-center justify-center text-center p-4">
      <div className="text-8xl mb-6">🌸</div>
      <h1 className="font-display text-6xl font-light text-gradient mb-3">404</h1>
      <p className="text-gray-500 text-lg mb-2">Page introuvable</p>
      <p className="text-gray-400 text-sm mb-8 max-w-xs">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link href="/" className="btn-primary text-sm inline-block">
        ← Retour à l'accueil
      </Link>
    </div>
  )
}
