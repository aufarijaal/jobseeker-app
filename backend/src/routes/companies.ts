import express from 'express'
import { Request, Response } from 'express'
import prisma from '../../prisma/client'
import { StatusCodes } from 'http-status-codes'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  const { q, page } = req.query

  try {
    const companies = await prisma.company.findMany({
      select: {
        name: true,
        about: true,
        industry: true,
        location: true,
        logo: true,
        slug: true,
      },
      where: {
        name: {
          contains: q as string,
          mode: 'insensitive',
        },
      },
    })

    res.send({
      data: {
        companies: companies.map((company) => {
          return {
            name: company.name,
            about: company.about,
            industry: company.industry,
            location: company.location,
            logo: `http://localhost:3001/company-logos/${company.logo}`,
            slug: company.slug,
          }
        }),
      },
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

router.get('/:companySlug', async (req: Request, res: Response) => {
  try {
    const { companySlug } = req.params

    const company = await prisma.company.findFirstOrThrow({
      where: {
        slug: {
          equals: companySlug,
          mode: 'insensitive',
        },
      },
      include: {
        Job: {
          select: {
            id: true,
            title: true,
            salary: true,
            location: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })

    res.send({
      data: company,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

router.post('/upload-company-logo', async (req: Request, res: Response) => {
  try {
    //
  } catch (error) {
    //
  }
})

export default router
