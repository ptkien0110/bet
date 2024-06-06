import { ObjectId } from 'mongodb'
import { ProductStatus } from '~/constants/enum'

export interface ProductReqBody {
  name: string
  images?: string[]
  description?: string
  category: string
  price_for_customer: number
  price_for_seller: number
  stock: number
  point?: number
  profit?: number
  discount?: number
}

export interface UpdateProductReqBody {
  name?: string
  description?: string
  category?: string
  price_for_customer?: number
  price_for_seller?: number
  stock?: number
  point?: number
  profit?: number
  discount?: number
}
