import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IOrderItem {
  productId:  string
  name:       string
  price:      number
  quantity:   number
  image?:     string
}

export interface IOrder extends Document {
  orderNumber:     string
  clientName:      string
  clientPhone:     string
  clientEmail?:    string
  items:           IOrderItem[]
  subtotal:        number
  total:           number
  paymentStatus:   'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'EXPIRED'
  fapshiTransId?:  string
  fapshiLink?:     string
  whatsappSent:    boolean
  notes?:          string
  createdAt:       Date
  updatedAt:       Date
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, min: 1 },
  image:     { type: String },
})

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber:   { type: String, required: true, unique: true },
    clientName:    { type: String, required: true, trim: true },
    clientPhone:   { type: String, required: true, trim: true },
    clientEmail:   { type: String, trim: true },
    items:         { type: [OrderItemSchema], required: true },
    subtotal:      { type: Number, required: true },
    total:         { type: Number, required: true },
    paymentStatus: {
      type:    String,
      enum:    ['PENDING', 'SUCCESSFUL', 'FAILED', 'EXPIRED'],
      default: 'PENDING',
    },
    fapshiTransId: { type: String },
    fapshiLink:    { type: String },
    whatsappSent:  { type: Boolean, default: false },
    notes:         { type: String },
  },
  { timestamps: true }
)

// Générer un numéro de commande unique
OrderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `BS-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  }
  next()
})

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)

export default Order
