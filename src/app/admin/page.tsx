'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, TrendingUp, LogOut, Plus, Edit, Trash2, Loader2, X, Check } from 'lucide-react'

interface Product { _id: string; name: string; price: number; category: string; stock: number; active: boolean; badge?: string; images: string[] }
interface Order   { _id: string; orderNumber: string; clientName: string; clientPhone: string; total: number; paymentStatus: string; createdAt: string; items: any[] }

type Tab = 'dashboard' | 'products' | 'orders'

const EMPTY_PRODUCT = { name: '', description: '', price: '', category: '', stock: '', badge: '', discount: '', images: '', featured: false }

export default function AdminDashboard() {
  const router  = useRouter()
  const [tab,      setTab]     = useState<Tab>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [orders,   setOrders]   = useState<Order[]>([])
  const [loading,  setLoading]  = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId,   setEditId]   = useState<string | null>(null)
  const [form,     setForm]     = useState<typeof EMPTY_PRODUCT>(EMPTY_PRODUCT)
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState('')

  const authHeader = () => ({ 'Content-Type': 'application/json' })

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [pRes, oRes] = await Promise.all([
        fetch('/api/products?limit=100'),
        fetch('/api/orders'),
      ])
      const pData = await pRes.json()
      const oData = oRes.ok ? await oRes.json() : { orders: [] }
      setProducts(pData.products || [])
      setOrders(oData.orders || [])
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const openCreate = () => { setForm(EMPTY_PRODUCT); setEditId(null); setShowForm(true) }
  const openEdit   = (p: Product) => {
    setForm({ name: p.name, description: (p as any).description || '', price: String(p.price), category: p.category, stock: String(p.stock), badge: p.badge || '', discount: '', images: p.images?.join(', ') || '', featured: (p as any).featured || false })
    setEditId(p._id)
    setShowForm(true)
  }

  const saveProduct = async () => {
    setSaving(true)
    try {
      const payload = {
        name: form.name, description: form.description,
        price: Number(form.price), category: form.category,
        stock: Number(form.stock), badge: form.badge || undefined,
        discount: form.discount ? Number(form.discount) : undefined,
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
        featured: form.featured,
      }
      const url    = editId ? `/api/products/${editId}` : '/api/products'
      const method = editId ? 'PUT' : 'POST'
      const res    = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(payload) })
      if (!res.ok) throw new Error((await res.json()).error)
      setMsg(editId ? 'Produit mis a jour' : 'Produit cree')
      setShowForm(false)
      fetchAll()
    } catch (e: any) { setMsg('Erreur: ' + e.message) } finally { setSaving(false) }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE', headers: authHeader() })
    fetchAll()
  }

  const statusColor: Record<string, string> = {
    SUCCESSFUL: 'bg-green-100 text-green-700',
    PENDING:    'bg-yellow-100 text-yellow-700',
    FAILED:     'bg-red-100 text-red-700',
    EXPIRED:    'bg-gray-100 text-gray-500',
  }

  const totalRevenue = orders.filter(o => o.paymentStatus === 'SUCCESSFUL').reduce((s, o) => s + o.total, 0)

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-56 bg-violet-950 text-white flex flex-col z-30 hidden md:flex">
        <div className="p-6 border-b border-violet-800">
          <h1 className="font-display text-xl font-semibold">skeu</h1>
          <p className="text-violet-400 text-xs mt-1">Administration</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {([
            ['dashboard', 'Tableau de bord', LayoutDashboard],
            ['products', 'Produits', Package],
            ['orders', 'Commandes', ShoppingBag],
          ] as const).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab === id ? 'bg-violet-700 text-white' : 'text-violet-200 hover:bg-violet-800'}`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>
        <div className="p-4">
          <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-3 text-violet-300 hover:text-white text-sm transition-colors">
            <LogOut size={16} /> Deconnexion
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="md:ml-56 p-6">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl text-gradient font-semibold">Admin</h1>
          <button onClick={logout} className="text-gray-400 hover:text-gray-600"><LogOut size={20} /></button>
        </div>
        {/* Mobile tabs */}
        <div className="md:hidden flex gap-2 mb-6 overflow-x-auto">
          {(['dashboard','products','orders'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${tab === t ? 'gradient-brand text-white' : 'bg-white text-gray-600 border'}`}>
              {t === 'dashboard' ? 'Dashboard' : t === 'products' ? 'Produits' : 'Commandes'}
            </button>
          ))}
        </div>

        {msg && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 flex items-center justify-between">
            {msg} <button onClick={() => setMsg('')}><X size={14} /></button>
          </div>
        )}

        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tableau de bord</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Produits',    value: products.length,                icon: Package,     color: 'bg-violet-50 text-violet-700' },
                { label: 'Commandes',   value: orders.length,                  icon: ShoppingBag, color: 'bg-blue-50 text-blue-700' },
                { label: 'Revenus (FCFA)', value: totalRevenue.toLocaleString(), icon: TrendingUp,  color: 'bg-green-50 text-green-700' },
              ].map(s => (
                <div key={s.label} className={`rounded-2xl p-6 ${s.color}`}>
                  <s.icon size={24} className="mb-3 opacity-70" />
                  <p className="text-3xl font-bold">{s.value}</p>
                  <p className="text-sm mt-1 opacity-70">{s.label}</p>
                </div>
              ))}
            </div>
            {/* Recent orders */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Dernieres commandes</h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map(o => (
                  <div key={o._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{o.clientName}</p>
                      <p className="text-xs text-gray-400">{o.orderNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">{o.total.toLocaleString()} FCFA</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[o.paymentStatus] || 'bg-gray-100'}`}>
                        {o.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Produits ({products.length})</h2>
              <button onClick={openCreate} className="btn-primary text-sm flex items-center gap-2">
                <Plus size={16} /> Ajouter
              </button>
            </div>

            {loading ? <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-violet-500" /></div> : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Produit</th>
                      <th className="px-4 py-3 text-left hidden sm:table-cell">Categorie</th>
                      <th className="px-4 py-3 text-left">Prix</th>
                      <th className="px-4 py-3 text-left hidden sm:table-cell">Stock</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map(p => (
                      <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                        <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{p.category}</td>
                        <td className="px-4 py-3 text-violet-700 font-semibold">{p.price.toLocaleString()} FCFA</td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.stock > 5 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-violet-600 transition-colors"><Edit size={15} /></button>
                            <button onClick={() => deleteProduct(p._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Commandes ({orders.length})</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">N° Commande</th>
                    <th className="px-4 py-3 text-left">Client</th>
                    <th className="px-4 py-3 text-left hidden sm:table-cell">Total</th>
                    <th className="px-4 py-3 text-left">Statut</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(o => (
                    <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{o.orderNumber}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{o.clientName}</p>
                        <p className="text-xs text-gray-400">{o.clientPhone}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800 hidden sm:table-cell">{o.total.toLocaleString()} FCFA</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColor[o.paymentStatus] || 'bg-gray-100'}`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell">
                        {new Date(o.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-800 text-lg">{editId ? 'Modifier produit' : 'Nouveau produit'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {[
                { key: 'name',        label: 'Nom *',         type: 'text' },
                { key: 'description', label: 'Description *', type: 'textarea' },
                { key: 'price',       label: 'Prix (FCFA) *', type: 'number' },
                { key: 'category',    label: 'Categorie *',   type: 'text' },
                { key: 'stock',       label: 'Stock *',       type: 'number' },
                { key: 'badge',       label: 'Badge (ex: Best Seller)', type: 'text' },
                { key: 'discount',    label: 'Reduction (%)', type: 'number' },
                { key: 'images',      label: 'URLs images (separees par virgule)', type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea rows={3} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-violet-400 resize-none" />
                  ) : (
                    <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-violet-400" />
                  )}
                </div>
              ))}
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 accent-violet-600" />
                Produit vedette (affiche sur la page d'accueil)
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="btn-outline flex-1 text-sm">Annuler</button>
              <button onClick={saveProduct} disabled={saving} className="btn-primary flex-1 text-sm flex items-center justify-center gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {editId ? 'Mettre a jour' : 'Creer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

