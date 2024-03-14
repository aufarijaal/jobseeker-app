import express from 'express'
import prisma from '../../prisma/client'
import { StatusCodes } from 'http-status-codes'
import makeSureEmployer from '../middleware/makeSureEmployer'
import type { Request, Response } from 'express'
import verifyToken from '../middleware/authMiddleware'
import slugify from 'slugify'

const router = express.Router()

router.get('/salary-ranges', async (req, res) => {
  try {
    const salaryRanges = await prisma.job.aggregate({
      _min: {
        salary: true,
      },
      _max: {
        salary: true,
      },
    })

    res.send(salaryRanges)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

router.get('/check-email-availability', async (req: Request, res: Response) => {
  try {
    const isAvailable = await prisma.user.findFirst({
      where: {
        email: {
          equals: req.query.email as string,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
      },
    })

    res.send({
      data: {
        isAvailable: typeof isAvailable?.id !== 'number',
      },
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

router.get('/skills', async (req: Request, res: Response) => {
  try {
    const exceptionIds = req.query.exceptionIds
    const q = req.query.q as string

    const skills = await prisma.skill.findMany({
      where: {
        name: {
          contains: q,
          mode: 'insensitive',
        },
        id: {
          notIn:
            typeof exceptionIds === 'string'
              ? [parseInt(exceptionIds)]
              : typeof exceptionIds === 'object'
              ? (exceptionIds as string[]).map((id) => parseInt(id))
              : [],
        },
      },
    })

    res.send({
      data: skills,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

router.get(
  '/job-seeker-skills',
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const jobSeekerSkills = await prisma.jobSeekerSkill.findMany({
        where: {
          jobSeekerId: (req as any).userId,
        },
        include: {
          skill: true,
        },
      })

      res.send({
        data: jobSeekerSkills,
      })
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
  }
)

router.post(
  '/job-seeker-skills',
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { skills: skillsToUpdate } = req.body

      const currentSkills = await prisma.jobSeekerSkill.findMany({
        where: {
          jobSeekerId: (req as any).userId,
        },
        select: {
          skillId: true,
        },
      })

      console.log(currentSkills)

      // check if user just updating exactly the same data
      // if (
      //   skillsToUpdate.every(
      //     (skill: any, i: number) => skill.id === currentSkills[i].skillId
      //   ) &&
      //   currentSkills.length === skillsToUpdate.length
      // ) {
      //   return res.status(StatusCodes.NOT_MODIFIED).send({
      //     message: 'You are just updating the same data',
      //   })
      // }

      // find what removed, added, and new skill going to be added. START 👇

      const skillToRemove = currentSkills.filter((currentSkill) => {
        return !skillsToUpdate.some(
          (skillToUpdate: any) => skillToUpdate.id === currentSkill.skillId
        )
      })

      // new skills that are not in the database yet and will be added into user skill list
      const newSkill = (
        skillsToUpdate as { id: number; name: string; slug: string }[]
      ).filter((skill) => skill.id === 0)

      // available skills from db that will be added to user skill list
      const skillsToAdd = skillsToUpdate.filter(
        (skillToUpdate: any) =>
          skillToUpdate.id !== 0 &&
          !currentSkills.some(
            (currentSkill) => currentSkill.skillId === skillToUpdate.id
          )
      )

      console.log(
        `skill to add new in skill table: ${JSON.stringify(newSkill)}`
      )
      console.log(
        `available skills in the db that need to be added in user skill list: ${JSON.stringify(
          skillsToAdd
        )}`
      )
      console.log(
        `skill to remove from user skill list: ${JSON.stringify(skillToRemove)}`
      )

      // --- find what removed, added, and new skill going to be added. END 👆

      prisma.$transaction(async (tx) => {
        // remove the skill that need to be removed
        await tx.jobSeekerSkill.deleteMany({
          where: {
            skillId: {
              in: skillToRemove.map((skill) => skill.skillId),
            },
          },
        })

        // add new skill (already existing skill in db) to job seeker skill list
        await tx.jobSeekerSkill.createMany({
          data: skillsToAdd.map((skill: any) => {
            return {
              jobSeekerId: (req as any).userId,
              skillId: skill.id,
            }
          }),
        })

        // add new user defined skill to db and connect them to user if available
        if (newSkill.length) {
          await tx.skill.createMany({
            data: newSkill.map((skill) => {
              return {
                name: skill.name,
                slug: slugify(skill.name, {
                  lower: true,
                }),
              }
            }),
            skipDuplicates: true,
          })

          const addedNewSkills = await tx.skill.findMany({
            where: {
              name: {
                in: newSkill.map((skill) => skill.name),
              },
              slug: {
                in: newSkill.map((skill) =>
                  slugify(skill.name, { lower: true })
                ),
              },
            },
            select: {
              id: true,
            },
          })

          await tx.jobSeekerSkill.createMany({
            data: addedNewSkills.map((skill) => {
              return {
                jobSeekerId: (req as any).userId,
                skillId: skill.id,
              }
            }),
          })
        }
      })

      res.send()

      // initial: vue js, react js
      // to: vue js, nextjs, docker
    } catch (error) {
      console.log(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
  }
)

export default router
