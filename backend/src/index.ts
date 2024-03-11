import cors from 'cors'
import express from 'express'
import expressListRoutes from 'express-list-routes'
import morgan from 'morgan'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import path from 'path'

// route imports
import { default as miscRoutes } from './routes/misc'
import { default as companyRoutes } from './routes/companies'
import { default as authRoutes } from './routes/auth'
import { default as accountRoutes } from './routes/account'
import { default as jobCategoryRoutes } from './routes/job-category'
import { default as jobRoutes } from './routes/jobs'
import applicationRouter from './routes/applications'
import savedJobsRouter from './routes/saved-jobs'

const app = express()

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public/storage')))
app.use(morgan('tiny'))
app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
app.use(express.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  res.send(`Welcome to jobseeker api.`)
})

app.use('/misc', miscRoutes)

app.use('/auth', authRoutes)
app.use('/companies', companyRoutes)
app.use('/account', accountRoutes)
app.use('/job-categories', jobCategoryRoutes)
app.use('/jobs', jobRoutes)
app.use('/applications', applicationRouter)
app.use('/saved-jobs', savedJobsRouter)
expressListRoutes(app)

const server = app.listen(3001, () =>
  console.log('🚀 Server ready at: http://localhost:3001')
)
