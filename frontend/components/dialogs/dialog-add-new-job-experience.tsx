import React, { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import axios from '@/lib/axios'
import { toast } from 'sonner'

function DialogAddNewJobExperience({
  children,
  onSuccess,
}: {
  children: React.ReactNode
  onSuccess: () => void
}) {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [open, setOpen] = useState(false)

  async function submit(e: any) {
    e.preventDefault()
    try {
      setLoading(true)
      await axios.post('/experiences', {
        title,
        companyName: company,
      })

      setOpen(false)
      onSuccess()
    } catch (error: any) {
      toast(error.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-border">
        <DialogHeader>
          <DialogTitle>Add new job experience</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={submit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                className="col-span-3"
                required
                onChange={(e) => setTitle(e.currentTarget.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input
                id="company"
                className="col-span-3"
                required
                onChange={(e) => setCompany(e.currentTarget.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogAddNewJobExperience
