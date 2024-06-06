import adminCategoryRouter from '~/routes/admin/admin-category.routes'
import adminProductRouter from '~/routes/admin/admin-product.routes'

const adminRoutes = {
  prefix: '/admin/',
  routes: [
    {
      path: 'categories',
      route: adminCategoryRouter
    },
    {
      path: 'products',
      route: adminProductRouter
    }
  ]
}

export default adminRoutes
