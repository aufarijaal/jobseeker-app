import React from 'react'
import { Button } from './ui/button'
import { BookmarkFilledIcon, BookmarkIcon } from '@radix-ui/react-icons'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'
import { toast } from 'sonner'

function JobSaveUnsaveButton({
  jobId,
  status,
}: {
  jobId: number
  status: boolean
}) {
  const { user, status: loginStatus } = useAuth()
  const router = useRouter()

  async function toggleSaveJob(e: any) {
    try {
      e.stopPropagation()
      e.preventDefault()

      if (user && loginStatus === 'loggedIn') {
        if (status) {
          await axios.delete('/saved-jobs/', {
            data: {
              jobId,
            },
          })
        } else {
          await axios.post('/saved-jobs/', {
            jobId,
          })
        }

        window.location.reload()
      }

      router.push('/auth/signin')
    } catch (error: any) {
      toast(error.message)
    }
  }

  return (
    <Button onClick={toggleSaveJob} variant={status ? 'secondary' : 'default'}>
      {status ? <BookmarkFilledIcon /> : <BookmarkIcon />}
    </Button>
  )
}

export default JobSaveUnsaveButton
