import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/authContext'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { toast } from 'sonner'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

function EmailSettingForm() {
  const { user } = useAuth()
  const [value, setValue] = useState(user?.email)

  async function submit(e: any) {
    try {
      e.preventDefault()

      await axios.put('/account/email', {
        email: value,
      })

      window.location.reload()
    } catch (error: any) {
      if (error.response.status === 409) {
        return toast('Email already in use', {
          icon: <ExclamationTriangleIcon className="text-orange-500" />,
        })
      }

      toast(error.message)
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="flex flex-col gap-4">
        <Label htmlFor="email" className="font-medium text-lg">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          defaultValue={user?.email}
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

export default EmailSettingForm
