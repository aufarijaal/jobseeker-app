import { Pencil1Icon } from '@radix-ui/react-icons'
import React, { useEffect, useRef, useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'sonner'
import { Skeleton } from '../ui/skeleton'
import { generatePhotoProfileUrl } from '@/lib/utils'

function ProfilePhotoForm() {
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [photoProfile, setPhotoProfile] = useState('')
  const [loading, setLoading] = useState(true)

  async function upload(e: any) {
    try {
      const file = e.target.files[0]

      if (file) {
        const formData = new FormData()
        formData.append('photo', e.target.files[0])

        await axios.put('/account/pp', formData)
        getPhotoProfile()
      } else {
        toast('You are not uploading any image')
      }
    } catch (error: any) {
      toast(error.message)
    }
  }

  async function getPhotoProfile() {
    try {
      setLoading(true)
      const result = await axios.get('/account/pp')

      setPhotoProfile(result.data.data.photoProfile)
    } catch (error: any) {
      toast(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getPhotoProfile()
  }, [])

  return (
    <form id="profile-photo-form">
      <label htmlFor="photo" className="text-md font-bold">
        Photo profile
      </label>

      {loading ? (
        <Skeleton className="w-[64px] h-[64px] rounded-full" />
      ) : (
        <div className="relative w-max h-max mt-4">
          <img
            className="w-16 h-16 rounded-full bg-white"
            src={
              photoProfile && photoProfile !== ''
                ? generatePhotoProfileUrl(photoProfile)
                : 'https://coenterprises.com.au/wp-content/uploads/2018/02/male-placeholder-image.jpeg'
            }
            alt="Profile photo"
          />

          <input
            type="file"
            id="photo"
            hidden
            accept="image/*"
            ref={photoInputRef}
            onChange={upload}
          />

          <button
            type="button"
            className="dark:bg-zinc-900 border border-border w-7 h-7 rounded-full flex items-center justify-center dark:hover:bg-zinc-800 absolute -bottom-2 -right-2"
            onClick={() => photoInputRef.current?.click()}
          >
            <Pencil1Icon />
          </button>
        </div>
      )}
    </form>
  )
}

export default ProfilePhotoForm
