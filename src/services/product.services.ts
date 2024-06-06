import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { CATEGORY_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/middlewares/error.middleware'
import { ProductReqBody, UpdateProductReqBody } from '~/models/requests/Product.request'
import Product from '~/models/schemas/Product.schema'
import databaseService from '~/services/database.services'
import { v2 as cloudinary } from 'cloudinary'
import { ProductStatus } from '~/constants/enum'

class ProductService {
  async createProduct({ body, fileData }: { body: ProductReqBody; fileData: any }) {
    const categoryId = body.category
    const category = await databaseService.categories.findOne({ _id: new ObjectId(categoryId) })
    if (!category) {
      const publicIds = (fileData as any[]).map((file) => file.filename)
      await cloudinary.api.delete_resources(publicIds)
      throw new ErrorWithStatus({
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
      })
    }
    console.log(fileData)
    const product = await databaseService.products.insertOne(
      new Product({
        name: body.name,
        images: fileData.map((item: any) => ({ path: item.path, filename: item.filename })),
        description: body.description,
        category: new ObjectId(categoryId),
        price_for_customer: Number(body.price_for_customer),
        price_for_seller: Number(body.price_for_seller),
        stock: Number(body.stock),
        point: Number(body.point),
        profit: Number(body.profit),
        discount: Number(body.discount)
      })
    )
    const data = await databaseService.products
      .aggregate([
        {
          $match: {
            _id: new ObjectId(product.insertedId)
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: '$category'
        }
      ])
      .toArray()

    return data[0]
  }

  async getProducts({ limit, page }: { limit: number; page: number }) {
    const products = await databaseService.products
      .aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: '$category'
        },

        {
          $skip: limit * (page - 1)
        },
        {
          $limit: limit
        }
      ])
      .toArray()

    const total = await databaseService.products.countDocuments({})
    return {
      products,
      total
    }
  }

  async getProduct(product_id: string) {
    const product = await databaseService.products
      .aggregate([
        {
          $match: {
            _id: new ObjectId(product_id)
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: '$category'
        }
      ])
      .toArray()
    return product[0]
  }

  async updateProduct(product_id: string, payload: UpdateProductReqBody) {
    const updatePayload: any = {
      ...(payload as UpdateProductReqBody),
      ...(payload.category && { category: new ObjectId(payload.category) })
    }

    const product = await databaseService.products.findOneAndUpdate(
      {
        _id: new ObjectId(product_id)
      },
      {
        $set: updatePayload,
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )

    const data = await databaseService.products
      .aggregate([
        {
          $match: {
            _id: new ObjectId(product_id)
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: {
            path: '$category',
            preserveNullAndEmptyArrays: true
          }
        }
      ])
      .toArray()

    return data[0]
  }

  async deleteProduct(product_id: string) {
    const product = await databaseService.products.findOneAndUpdate(
      { _id: new ObjectId(product_id) },
      {
        $set: {
          destroy: ProductStatus.Hidden
        }
      },
      {
        returnDocument: 'after'
      }
    )
    const data = await databaseService.products
      .aggregate([
        {
          $match: {
            _id: new ObjectId(product_id)
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: {
            path: '$category',
            preserveNullAndEmptyArrays: true
          }
        }
      ])
      .toArray()

    return data[0]
  }

  async deleteImageProduct(product_id: string, public_id: string) {
    const product = await databaseService.products.findOne({ _id: new ObjectId(product_id) })

    if (!product) {
      throw Error('Product not found')
    }

    if (!product.images || product.images.length === 0) {
      throw Error('Product has no images')
    }

    const imageIndex = product.images.findIndex((image) => image.split('/').pop()?.split('.')[0] === public_id)
    if (imageIndex === -1) {
      throw Error('Image not found')
    }

    const publicId = product.images[imageIndex].split('/').pop()?.split('.')[0] as string
    await cloudinary.api.delete_resources([publicId])

    product.images.splice(imageIndex, 1)
    await databaseService.products.updateOne({ _id: new ObjectId(product_id) }, { $set: { images: product.images } })

    const data = await databaseService.products
      .aggregate([
        {
          $match: {
            _id: new ObjectId(product_id)
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: {
            path: '$category',
            preserveNullAndEmptyArrays: true
          }
        }
      ])
      .toArray()

    return data[0]
  }

  async uploadImageProduct(product_id: string, imageFiles: Express.Multer.File[]) {
    const MAX_IMAGE_COUNT = 4
    const product = await databaseService.products.findOne({ _id: new ObjectId(product_id) })

    if (!product) {
      throw new Error('Product not found')
    }

    const currentImageCount = product.images ? product.images.length : 0
    if (currentImageCount + imageFiles.length > MAX_IMAGE_COUNT) {
      throw new Error(`Số lượng ảnh không được vượt quá ${MAX_IMAGE_COUNT}`)
    }

    await databaseService.products.updateOne(
      { _id: new ObjectId(product_id) },
      { $push: { images: { $each: imageFiles.map((item: any) => item.path) } } }
    )

    const data = await databaseService.products
      .aggregate([
        {
          $match: {
            _id: new ObjectId(product_id)
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: {
            path: '$category',
            preserveNullAndEmptyArrays: true
          }
        }
      ])
      .toArray()

    return data[0]
  }
}
const productService = new ProductService()
export default productService
