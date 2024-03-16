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
import DialogAddNewJobExperience from './dialogs/dialog-add-new-job-experience'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { toast } from 'sonner'
import DialogEditJobExperience from './dialogs/dialog-edit-job-experience'

function JobExperienceManagement() {
  const [jobExperiences, setJobExperience] = useState<
    { id: number; title: string; companyName: string; userId: number }[]
  >([])
  const [editMode, setEditMode] = useState(false)

  async function getJobExperiences() {
    const result = await axios.get('/experiences')

    setJobExperience(result.data.data)
  }

  async function deleteJobExperienceItem(id: number) {
    try {
      if (confirm('Are you sure want to delete this item?')) {
        await axios.delete('/experiences/' + id)
      } else {
        toast('Delete canceled')
      }

      getJobExperiences()
    } catch (error: any) {
      toast(error.message)
    }
  }

  useEffect(() => {
    getJobExperiences()
  }, [])

  return (
    <div id="job-experience-management">
      <Label htmlFor="job-experience" className="text-md font-bold">
        Your Job Experience
      </Label>

      <div id="job-experience-list" className="my-4 flex flex-col gap-2">
        {jobExperiences.map((jobExperience) => {
          return (
            <div id="job-experience-item" className="flex gap-1">
              <div
                className="border-border border rounded-xl min-w-[300px] w-full md:w-max h-max p-4"
                key={jobExperience.id}
              >
                <div className="dark:text-zinc-400 mb-1">
                  {/* Job Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="M6 1a1.75 1.75 0 0 0-1.75 1.75V4H3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.25V2.75A1.75 1.75 0 0 0 10 1zm4.25 3V2.75A.25.25 0 0 0 10 2.5H6a.25.25 0 0 0-.25.25V4zM3 5.5h10a.5.5 0 0 1 .5.5v1h-11V6a.5.5 0 0 1 .5-.5m-.5 3V13a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8.5H9V10H7V8.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-md font-bold">{jobExperience.title}</div>
                <div className="dark:text-zinc-400 text-xs">
                  <span>at&nbsp;</span>
                  {jobExperience.companyName}
                </div>
              </div>

              <div className="grid grid-rows-2 gap-1">
                <DialogEditJobExperience
                  onSuccess={getJobExperiences}
                  data={jobExperience}
                >
                  <button className="bg-green-600 p-1.5 rounded-md hover:bg-green-500">
                    <Pencil1Icon />
                  </button>
                </DialogEditJobExperience>
                <button
                  className="bg-rose-600 p-1.5 rounded-md hover:bg-rose-500"
                  onClick={() => deleteJobExperienceItem(jobExperience.id)}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* The dialog */}
      <DialogAddNewJobExperience onSuccess={getJobExperiences}>
        <Button className="w-full md:max-w-[300px]" variant="secondary">
          Add new
        </Button>
      </DialogAddNewJobExperience>
    </div>
  )
}

export default JobExperienceManagement
