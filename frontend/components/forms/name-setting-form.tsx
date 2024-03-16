import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/authContext'
import { useState } from 'react'
import { toast } from 'sonner'
import { Label } from '../ui/label'
import axios from '@/lib/axios'

function NameSettingForm() {
  const { user } = useAuth()
  const [value, setValue] = useState(user?.fullName)

  async function submit(e: any) {
    try {
      e.preventDefault()

      await axios.put('/account/name', {
        fullName: value,
      })

      window.location.reload()
    } catch (error: any) {
      toast(error.message)
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="flex flex-col gap-4">
        <Label htmlFor="name" className="font-medium text-lg">
          Full Name
        </Label>
        <Input
          id="name"
          name="name"
          defaultValue={user?.fullName}
          required
          onChange={(e) => setValue(e.currentTarget.value)}
        />
      </div>

      <div className="mt-4">
        <Button variant="secondary" type="submit">
          Change
        </Button>
      </div>
    </form>
  )
}

export default NameSettingForm
