import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import {
  ExclamationTriangleIcon,
  EyeClosedIcon,
  EyeOpenIcon,
} from '@radix-ui/react-icons'
import { toast } from 'sonner'
import axios from '@/lib/axios'

function PasswordSettingForm() {
  const formSchema = z
    .object({
      oldPassword: z.string(),
      password: z.string().min(6),
      passwordConfirm: z.string().min(6),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "Passwords don't match",
      path: ['passwordConfirm'],
    })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const [showOldPass, setShowOldPass] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showPassConfirm, setShowPassConfirm] = useState(false)

  async function onSubmit() {
    try {
      await axios.put('/account/password', {
        oldPassword: form.getValues('oldPassword'),
        newPassword: form.getValues('password'),
      })

      window.location.reload()
    } catch (error: any) {
      if (error.response.status === 400) {
        return toast(error.response.data.message, {
          icon: <ExclamationTriangleIcon className="text-rose-500" />,
        })
      }
      toast(error.message)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Old Password</FormLabel>
              <FormControl>
                <div className="flex gap-1">
                  <Input
                    placeholder="••••••••••••••"
                    required
                    type={showOldPass ? 'text' : 'password'}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowOldPass(!showOldPass)}
                  >
                    {showOldPass ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">New Password</FormLabel>
              <FormControl>
                <div className="flex gap-1">
                  <Input
                    placeholder="••••••••••••••"
                    required
                    type={showPass ? 'text' : 'password'}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">
                New Password Confirmation
              </FormLabel>
              <FormControl>
                <div className="flex gap-1">
                  <Input
                    placeholder="••••••••••••••"
                    required
                    type={showPassConfirm ? 'text' : 'password'}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowPassConfirm(!showPassConfirm)}
                  >
                    {showPassConfirm ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="secondary">
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default PasswordSettingForm
