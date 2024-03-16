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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select'

function DialogAddNewEducation({
  children,
  onSuccess,
}: {
  children: React.ReactNode
  onSuccess: () => void
}) {
  const [institution, setInstitution] = useState('')
  const [major, setMajor] = useState('')
  const [level, setLevel] = useState<EducationLevel>('SD')
  const [loading, setLoading] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [open, setOpen] = useState(false)

  async function submit(e: any) {
    e.preventDefault()
    try {
      setLoading(true)
      await axios.post('/educations', {
        level,
        institution,
        major,
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
          <DialogTitle>Add new education</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={submit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level" className="text-right">
                Level
              </Label>
              <Select
                required
                onValueChange={(v: EducationLevel) => setLevel(v)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Education Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Education Level</SelectLabel>
                    <SelectItem value={'SD'}>SD</SelectItem>
                    <SelectItem value={'SMP'}>SMP</SelectItem>
                    <SelectItem value={'SMA'}>SMA</SelectItem>
                    <SelectItem value={'DIPLOMA_1'}>D1</SelectItem>
                    <SelectItem value={'DIPLOMA_2'}>D2</SelectItem>
                    <SelectItem value={'DIPLOMA_3'}>D3</SelectItem>
                    <SelectItem value={'DIPLOMA_4'}>D4</SelectItem>
                    <SelectItem value={'SARJANA'}>S1</SelectItem>
                    <SelectItem value={'MAGISTER'}>S2</SelectItem>
                    <SelectItem value={'DOKTOR'}>S3</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="institution" className="text-right">
                Institution name
              </Label>
              <Input
                id="institution"
                className="col-span-3"
                required
                onChange={(e) => setInstitution(e.currentTarget.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="major" className="text-right">
                Major
              </Label>
              <Input
                id="major"
                className="col-span-3"
                required
                onChange={(e) => setMajor(e.currentTarget.value)}
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

export default DialogAddNewEducation
