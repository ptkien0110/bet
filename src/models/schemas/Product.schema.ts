import { ObjectId } from 'mongodb'
import { ProductStatus } from '~/constants/enum'

interface ProductType {
  _id?: ObjectId
  name: string
  images?: string[]
  description?: string
  category: ObjectId
  price_for_customer: number
  price_for_seller: number
  stock: number
  sold?: number
  view?: number
  point?: number
  profit?: number
  discount?: number
  destroy?: ProductStatus
  created_at?: Date
  updated_at?: Date
}

export default class Product {
  _id?: ObjectId
  name: string
  images?: string[]
  description?: string
  category: ObjectId
  price_for_customer: number
  price_for_seller: number
  stock: number
  sold?: number
  view?: number
  point?: number
  profit?: number
  discount?: number
  destroy?: ProductStatus
  created_at?: Date
  updated_at?: Date
  constructor(product: ProductType) {
    this._id = product._id
    this.name = product.name || ''
    this.images = product.images || []
    this.description = product.description || ''
    this.category = product.category
    this.price_for_customer = product.price_for_customer || 0
    this.price_for_seller = product.price_for_seller || 0
    this.stock = product.stock || 100
    this.sold = product.sold || 0
    this.view = product.view || 0
    this.point = product.point || 0
    this.profit = product.profit || 0
    this.discount = product.discount || 0
    this.destroy = product.destroy || ProductStatus.Hidden
    this.created_at = product.created_at || new Date()
    this.updated_at = product.updated_at || new Date()
  }
}
