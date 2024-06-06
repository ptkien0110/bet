import { NextFunction, Request, Response } from 'express'
import { PRODUCT_MESSAGES } from '~/constants/messages'
import productService from '~/services/product.services'

export const createProductController = async (req: Request, res: Response, next: NextFunction) => {
  const fileData = req.files
  const body = req.body
  const data = await productService.createProduct({ body, fileData })
  return res.json({
    message: PRODUCT_MESSAGES.CREATE_PRODUCT_SUCCESS,
    data
  })
}

export const getProductsController = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)

  const data = await productService.getProducts({ limit, page })
  return res.json({
    message: PRODUCT_MESSAGES.CREATE_PRODUCT_SUCCESS,
    data: {
      products: data.products,
      limit,
      page,
      total_page: Math.ceil(data.total / limit)
    }
  })
}

export const getProductController = async (req: Request, res: Response) => {
  const { product_id } = req.params
  const data = await productService.getProduct(product_id)
  return res.json({
    message: PRODUCT_MESSAGES.GET_PRODUCT_SUCCESS,
    data
  })
}

export const updateProductController = async (req: Request, res: Response) => {
  const { product_id } = req.params
  const payload = req.body
  const data = await productService.updateProduct(product_id, payload)
  return res.json({
    message: PRODUCT_MESSAGES.UPDATE_PRODUCT_SUCCESS,
    data
  })
}

export const deleteProductController = async (req: Request, res: Response) => {
  const { product_id } = req.params
  const data = await productService.deleteProduct(product_id)
  return res.json({
    message: PRODUCT_MESSAGES.DELETE_PRODUCT_SUCCESS,
    data
  })
}

export const deleteProductImageController = async (req: Request, res: Response) => {
  const { product_id, public_id } = req.params
  const data = await productService.deleteImageProduct(product_id, public_id)
  return res.json({
    message: PRODUCT_MESSAGES.DELETE_PRODUCT_SUCCESS,
    data
  })
}

export const uploadProductImagesController = async (req: Request, res: Response) => {
  const imageFiles = req.files as Express.Multer.File[]
  const { product_id } = req.params
  const data = await productService.uploadImageProduct(product_id, imageFiles)
  return res.json({
    message: PRODUCT_MESSAGES.DELETE_PRODUCT_SUCCESS,
    data
  })
}
