import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import axios from '@/lib/axios'
import { toast } from 'sonner'

function AboutMeForm() {
  const [value, setValue] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const maxLength = 250

  async function getAbout() {
    try {
      setLoading(true)
      const result = await axios.get('/account/about')

      setValue(result.data.data.about)
    } catch (error: any) {
      toast(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateAbout() {
    try {
      setLoading(true)
      await axios.put('/account/about', {
        about: value,
      })

      setEditMode(false)
      getAbout()
    } catch (error: any) {
      toast(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAbout()
  }, [])
  return (
    <div className="mt-2">
      <div className="grid w-full max-w-[600px] gap-1.5 mb-4">
        <Label htmlFor="bio" className="text-md font-bold">
          About you
        </Label>
        {editMode ? (
          <>
            <Textarea
              placeholder={`Max ${maxLength} characters`}
              id="bio"
              maxLength={maxLength}
              value={value}
              onInput={(e) => setValue(e.currentTarget.value)}
            />
            <p
              className={`text-[10px] ${
                value.length === maxLength
                  ? 'text-rose-500'
                  : 'text-muted-foreground'
              }`}
            >
              {value.length} / {maxLength}
            </p>
          </>
        ) : (
          <div className="text-sm dark:text-zinc-300">{value}</div>
        )}
      </div>

      {editMode ? (
        <div className="flex gap-2">
          <Button className="w-max" onClick={updateAbout}>
            Submit
          </Button>
          <Button
            className="w-max"
            variant="secondary"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button variant="secondary" onClick={() => setEditMode(true)}>
          Edit
        </Button>
      )}
    </div>
  )
}

export default AboutMeForm
