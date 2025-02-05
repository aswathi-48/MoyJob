import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connection from './config/db.js'
import { errorHandler, notFound } from './middlewares/errorMiddleware.js'
import userRoutes from './routes/userRutes.js'
// import adminRoutes from './routes/adminRoutes.js'
import companyRoutes from './routes/companyRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import testRoutes from './routes/testRoutes.js'
import skillRoutes from './routes/skillRoutes.js'
import subscribeRoutes from './routes/subscribeRoutes.js'
import applicationRoutes from './routes/applicatinRoutes.js'
import { fileURLToPath } from 'url';
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config()
const port = process.env.PORT || 7000
const app = express()

connection()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use('/user',userRoutes)
// app.use('/admin',adminRoutes)
app.use('/company',companyRoutes)
app.use('/job',jobRoutes)
app.use('/test',testRoutes)
app.use('/skill',skillRoutes)
app.use('/subscribe',subscribeRoutes)
app.use('/application',applicationRoutes)
app.use('', express.static(join(__dirname, 'upload')));


app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`server running om port ${port}`));
