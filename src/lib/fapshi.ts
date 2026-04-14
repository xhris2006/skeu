const FAPSHI_BASE_URL = process.env.FAPSHI_BASE_URL || 'https://live.fapshi.com'
const FAPSHI_API_USER = process.env.FAPSHI_API_USER || ''
const FAPSHI_API_KEY = process.env.FAPSHI_API_KEY || ''

const headers = {
  'Content-Type': 'application/json',
  apiuser: FAPSHI_API_USER,
  apikey: FAPSHI_API_KEY,
}

export interface FapshiPaymentPayload {
  amount: number
  phone?: string
  redirectUrl?: string
  userId?: string
  externalId?: string
  message?: string
}

export interface FapshiPaymentResponse {
  message: string
  link?: string
  transId?: string
  statusCode: number
}

export interface FapshiStatusResponse {
  message: string
  status: 'SUCCESSFUL' | 'PENDING' | 'FAILED' | 'EXPIRED'
  transId: string
  amount: number
  statusCode: number
}

export async function createPaymentLink(payload: FapshiPaymentPayload): Promise<FapshiPaymentResponse> {
  const res = await fetch(`${FAPSHI_BASE_URL}/initiate-pay`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      amount: payload.amount,
      redirectUrl: payload.redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      userId: payload.userId,
      externalId: payload.externalId,
      message: payload.message || 'skeu - Paiement commande',
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Erreur Fapshi lors de la creation du lien')
  }

  return data
}

export async function checkPaymentStatus(transId: string): Promise<FapshiStatusResponse> {
  const res = await fetch(`${FAPSHI_BASE_URL}/payment-status/${transId}`, {
    method: 'GET',
    headers,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Erreur Fapshi lors de la verification du statut')
  }

  return data
}

export function generateWhatsAppMessage(params: {
  clientName: string
  phone: string
  products: { name: string; quantity: number; price: number }[]
  total: number
  transId: string
}) {
  const productLines = params.products
    .map((p) => `  - ${p.name} x${p.quantity} -> ${p.price * p.quantity} FCFA`)
    .join('\n')

  const message = encodeURIComponent(
    `Bonjour skeu !\n\n` +
    `J'ai effectue un paiement avec succes.\n\n` +
    `Client : ${params.clientName}\n` +
    `Telephone : ${params.phone}\n\n` +
    `Commande :\n${productLines}\n\n` +
    `Montant paye : ${params.total} FCFA\n` +
    `ID Transaction : ${params.transId}\n\n` +
    `Merci de confirmer ma livraison.`
  )

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '237600000000'
  return `https://wa.me/${waNumber}?text=${message}`
}
