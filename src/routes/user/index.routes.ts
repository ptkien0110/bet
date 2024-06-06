import { userUserRouter } from '~/routes/user/user-user.routes'

const userRoutes = {
  prefix: '/',
  routes: [
    {
      path: 'user',
      route: userUserRouter
    }
  ]
}

export default userRoutes
