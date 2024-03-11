import express from 'express'
import { Request, Response } from 'express'
import prisma from '../../prisma/client'
import { StatusCodes } from 'http-status-codes'
import { getCompanies, uploadCompanyLogo, getCompanyDetail } from '../controllers/companyController'

const router = express.Router()

router.get('/', getCompanies)

router.get('/:companySlug', getCompanyDetail)

router.post('/upload-company-logo', uploadCompanyLogo)

export default router
