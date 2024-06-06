import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { CATEGORY_MESSAGES, PRODUCT_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/middlewares/error.middleware'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validations'

export const productValidator = validate(
  checkSchema({
    name: {
      optional: true,
      isString: {
        errorMessage: PRODUCT_MESSAGES.NAME_MUST_BE_A_STRING
      },
      trim: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        },
        errorMessage: PRODUCT_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
      }
    },
    description: {
      optional: true,
      isString: {
        errorMessage: PRODUCT_MESSAGES.NAME_MUST_BE_A_STRING
      },
      trim: true
    },
    category: {
      optional: true,
      custom: {
        options: async (value: string, { req }) => {
          if (!ObjectId.isValid(new ObjectId(value))) {
            throw new ErrorWithStatus({
              message: CATEGORY_MESSAGES.INVALID_CATEGORY_ID,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          const cateInDB = await databaseService.categories.findOne({ _id: new ObjectId(value) })
          if (!cateInDB) {
            throw new ErrorWithStatus({
              message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND,
              status: HTTP_STATUS.NOT_FOUND
            })
          }
          return true
        }
      }
    },
    price_for_customer: {
      optional: true,
      isNumeric: {
        errorMessage: PRODUCT_MESSAGES.PRICE_MUST_BE_A_NUMBER
      }
    },
    price_for_seller: {
      optional: true,
      isNumeric: {
        errorMessage: PRODUCT_MESSAGES.PRICE_MUST_BE_A_NUMBER
      }
    },
    stock: {
      optional: true,
      isNumeric: {
        errorMessage: PRODUCT_MESSAGES.STOCK_MUST_BE_A_NUMBER
      }
    },
    point: {
      optional: true,
      isNumeric: {
        errorMessage: PRODUCT_MESSAGES.POINT_MUST_BE_A_NUMBER
      }
    },
    profit: {
      optional: true,
      isNumeric: {
        errorMessage: PRODUCT_MESSAGES.PROFIT_MUST_BE_A_NUMBER
      }
    },
    discount: {
      optional: true,
      isNumeric: {
        errorMessage: PRODUCT_MESSAGES.PROFIT_MUST_BE_A_NUMBER
      }
    }
  })
)
export const productIdValidator = validate(
  checkSchema(
    {
      product_id: {
        notEmpty: {
          errorMessage: PRODUCT_MESSAGES.INVALID_PRODUCT_ID
        },
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: PRODUCT_MESSAGES.INVALID_PRODUCT_ID,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            const productInDB = await databaseService.products.findOne({ _id: new ObjectId(value) })
            if (productInDB == null) {
              throw new ErrorWithStatus({
                message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)

export const paginationValidator = validate(
  checkSchema({
    limit: {
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          const num = Number(value)
          if (num > 100 || num < 1) {
            throw new Error('1 <= limit <= 100')
          }
          return true
        }
      }
    },
    page: {
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          const num = Number(value)
          if (num < 1) {
            throw new Error('page >= 1')
          }
          return true
        }
      }
    }
  })
)
