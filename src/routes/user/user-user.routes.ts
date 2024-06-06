import { Router } from 'express'

export const userUserRouter = Router()
userUserRouter.get('/products', (req, res) => {
  res.json({
    id: 1,
    text: 'hello world'
  })
})
