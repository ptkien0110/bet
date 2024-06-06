import express from 'express'
import { defaultErrorHandler } from '~/middlewares/error.middleware'
import commonRoutes from '~/routes/common/index.routes'
import userRoutes from '~/routes/user/index.routes'
import databaseService from '~/services/database.services'
import cors, { CorsOptions } from 'cors'
import cookieParser from 'cookie-parser'
import adminRoutes from '~/routes/admin/index.routes'
import multer from 'multer'
const app = express()
const port = 4000
databaseService.connect()
app.use(express.json())
app.use(cookieParser())
const corsOptions = {
  origin:[ "http://localhost:3000","http://localhost:3001"],  // Đổi theo frontend của bạn
  credentials: true, // Cho phép gửi cookie
};

app.use(cors(corsOptions))

const routes = [{ ...userRoutes }, { ...commonRoutes }, { ...adminRoutes }]

routes.forEach((item) => item.routes.forEach((route) => app.use(item.prefix + route.path, route.route)))
app.use(defaultErrorHandler)
app.get("/", (req, res) => {
  res.send("Hello World! back end ");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
