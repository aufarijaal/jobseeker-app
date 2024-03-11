import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

const Signup = () => {
  const form = useForm()
  const [showpass, setshowpass] = useState(false)
  const [showpassconfirm, setshowpassconfirm] = useState(false)

  function onSubmit() {
    return
  }

  return (
    <main className="min-h-screen w-full grid place-items-center">
      <div className="w-[400px]">
        <div className="mb-8 text-center space-y-4">
          <div className="text-3xl font-semibold">Employer Sign Up</div>
          <div className="text-sm dark:text-gray-500">
            Create a new employer account.
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        required
                        placeholder="John"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        required
                        placeholder="Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      required
                      placeholder="abc@xyz.com"
                      {...field}
                    />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      <Input
                        placeholder="••••••••••••••"
                        required
                        type={showpass ? 'text' : 'password'}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setshowpass(!showpass)}
                      >
                        {showpass ? <EyeClosedIcon /> : <EyeOpenIcon />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Cofirmation</FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      <Input
                        placeholder="••••••••••••••"
                        required
                        type={showpassconfirm ? 'text' : 'password'}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setshowpassconfirm(!showpassconfirm)}
                      >
                        {showpassconfirm ? <EyeClosedIcon /> : <EyeOpenIcon />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
        <div>
          <div className="text-xs dark:text-gray-400 text-center mt-6">
            Already have an employer account?&nbsp;
            <Link
              className="dark:text-white hover:underline font-semibold"
              href="/auth/signin"
            >
              Sign in as Employer
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Signup
