import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  BookmarkFilledIcon,
  BookmarkIcon,
  ClockIcon,
  DrawingPinIcon,
  IdCardIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons'
import { formatLastActive } from '@/lib/utils'
import Link from 'next/link'
import { toast } from 'sonner'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'

export function JobCard(props: {
  jobInfo: {
    id: number
    title: string
    description: string
    requirements: string
    location: string
    salary: {
      raw: number
      formatted: string
    }
    createdAt: string
    companyId: number
    employerId: number
    company: {
      name: string
      logo: string
    }
    savedByThisJobSeeker: boolean
  }
  afterToggling: () => void
}) {
  const { user, status } = useAuth()
  const router = useRouter()

  async function toggleSaveJob(e: any) {
    try {
      e.stopPropagation()
      e.preventDefault()

      if (user && status === 'loggedIn') {
        if (props.jobInfo.savedByThisJobSeeker) {
          await axios.delete('/saved-jobs/', {
            data: {
              jobId: props.jobInfo.id,
            },
          })
        } else {
          await axios.post('/saved-jobs/', {
            jobId: props.jobInfo.id,
          })
        }

        return props.afterToggling()
      }

      router.push('/auth/signin')
    } catch (error: any) {
      toast(error.message)
    }
  }

  return (
    <Link href={`/job/${props.jobInfo.id}`}>
      <Card className="w-full flex-shrink-0 dark:border-border dark:hover:border-gray-600 transition-colors cursor-pointer">
        <CardHeader>
          <div className="flex gap-4 items-center">
            <div>
              <img
                src={`${process.env.NEXT_PUBLIC_SERVER_HOST}/company-logos/${props.jobInfo.company.logo}`}
                className="w-10 h-10 object-contain bg-white rounded-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <CardTitle className="text-xl">{props.jobInfo.title}</CardTitle>
              <CardDescription>{props.jobInfo.company.name}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2 text-gray-300 text-sm font-semibold">
            <li className="flex gap-4 items-center">
              <IdCardIcon />
              <span>{props.jobInfo.salary.formatted}</span>
            </li>
            <li className="flex gap-4 items-center">
              <DrawingPinIcon />
              <span>{props.jobInfo.location}</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-between items-center dark:text-gray-400 text-sm">
          <div className="flex gap-2 items-center text-xs">
            <ClockIcon />
            {'Posted ' + props.jobInfo.createdAt}
          </div>

          <Button
            onClick={toggleSaveJob}
            variant={
              props.jobInfo.savedByThisJobSeeker ? 'secondary' : 'default'
            }
          >
            {props.jobInfo.savedByThisJobSeeker ? (
              <BookmarkFilledIcon />
            ) : (
              <BookmarkIcon />
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
