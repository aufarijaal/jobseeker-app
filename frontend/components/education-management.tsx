import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import axios from '@/lib/axios'
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { toast } from 'sonner'
import DialogEditEducation from './dialogs/dialog-edit-education'
import DialogAddNewEducation from './dialogs/dialog-add-new-education'
import { parseEducationLevel } from '@/lib/utils'

function EducationManagement() {
  const [educations, setEducation] = useState<
    { id: number; level: EducationLevel; institution: string; major: string }[]
  >([])
  const [editMode, setEditMode] = useState(false)

  async function getEducations() {
    const result = await axios.get('/educations')

    setEducation(result.data.data)
  }

  async function deleteEducationItem(id: number) {
    try {
      if (confirm('Are you sure want to delete this item?')) {
        await axios.delete('/educations/' + id)
      } else {
        toast('Delete canceled')
      }

      getEducations()
    } catch (error: any) {
      toast(error.message)
    }
  }

  useEffect(() => {
    getEducations()
  }, [])

  return (
    <div id="education-management">
      <Label htmlFor="education" className="text-md font-bold">
        Educations
      </Label>

      <div id="education-list" className="my-4 flex flex-col gap-2">
        {educations.map((education) => {
          return (
            <div id="education-item" className="flex gap-1">
              <div
                className="border-border border rounded-xl min-w-[300px] w-full md:w-max h-max p-4"
                key={education.id}
              >
                <div className="dark:text-zinc-400 mb-1">
                  {/* Job Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9zm6.82 6L12 12.72L5.18 9L12 5.28zM17 16l-5 2.72L7 16v-3.73L12 15l5-2.73z"
                    />
                  </svg>
                </div>
                <div className="text-md font-bold">{education.institution}</div>
                <div className="dark:text-zinc-400 text-xs">
                  {parseEducationLevel(education.level)} - {education.major}
                </div>
              </div>

              <div className="grid grid-rows-2 gap-1">
                <DialogEditEducation onSuccess={getEducations} data={education}>
                  <button className="bg-green-600 p-1.5 rounded-md hover:bg-green-500">
                    <Pencil1Icon />
                  </button>
                </DialogEditEducation>
                <button
                  className="bg-rose-600 p-1.5 rounded-md hover:bg-rose-500"
                  onClick={() => deleteEducationItem(education.id)}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* The dialog */}
      <DialogAddNewEducation onSuccess={getEducations}>
        <Button className="w-full md:max-w-[300px]" variant="secondary">
          Add new
        </Button>
      </DialogAddNewEducation>
    </div>
  )
}

export default EducationManagement
