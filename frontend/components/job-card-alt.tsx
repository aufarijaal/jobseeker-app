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
  BookmarkIcon,
  ClockIcon,
  DrawingPinIcon,
  IdCardIcon,
} from '@radix-ui/react-icons'
import { formatLastActive } from '@/lib/utils'
import Link from 'next/link'

export function JobCardAlt(props: {
  jobInfo: {
    id: number,
    title: string
    companyImageUrl: string
    companyTitle: string
    salary: string
    location: string
    lastActive: string
    savedStatus: boolean
  }
}) {
  return (
    <Link href={`/job/${props.jobInfo.id}`}>
      <Card className="w-full flex-shrink-0 dark:border-border dark:hover:border-gray-600 transition-colors cursor-pointer rounded-md">
        <CardHeader className="p-4">
          <div className="flex gap-4 items-center">
            <div>
              <img
                src={props.jobInfo.companyImageUrl}
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-md">{props.jobInfo.title}</CardTitle>
              <CardDescription className="text-xs">
                {props.jobInfo.companyTitle}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2 text-gray-300 text-xs font-semibold">
            <li className="flex gap-4 items-center">
              <IdCardIcon />
              <span>{props.jobInfo.salary}</span>
            </li>
            <li className="flex gap-4 items-center">
              <DrawingPinIcon />
              <span>{props.jobInfo.location}</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-between items-center dark:text-gray-400 text-xs p-4">
          <div className="flex gap-2 items-center">
            <ClockIcon />
            {formatLastActive(props.jobInfo.lastActive)}
          </div>
          <Button>
            <BookmarkIcon />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
