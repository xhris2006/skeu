import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IProduct extends Document {
  name:        string
  description: string
  price:       number
  images:      string[]
  category:    string
  stock:       number
  badge?:      string   // ex: "Best Seller", "50% OFF", "New"
  discount?:   number   // pourcentage de réduction
  featured:    boolean
  active:      boolean
  createdAt:   Date
  updatedAt:   Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true, min: 0 },
    images:      { type: [String], default: [] },
    category:    { type: String, required: true, trim: true },
    stock:       { type: Number, required: true, default: 0, min: 0 },
    badge:       { type: String },
    discount:    { type: Number, min: 0, max: 100 },
    featured:    { type: Boolean, default: false },
    active:      { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Index pour la recherche
ProductSchema.index({ name: 'text', description: 'text', category: 'text' })

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)

export default Product
