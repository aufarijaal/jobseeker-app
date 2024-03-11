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
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from '@/lib/axios'
import Head from 'next/head'
import { useAuth } from '@/context/authContext'

const Signin = () => {
  const [showpass, setshowpass] = useState(false)
  const [responseMsg, setResponseMsg] = useState('')

  const formSchema = z.object({
    email: z.string().min(1).email().trim(),
    password: z.string().min(6),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const {signin} = useAuth()

  async function onSubmit() {
    signin(form.getValues())
  }

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <main className="min-h-screen w-full grid place-items-center">
        <div className="w-[300px]">
          <div className="mb-8 text-center space-y-4">
            <div className="text-3xl font-semibold">Sign in</div>
            <div className="text-sm dark:text-gray-500">
              Sign in to your existing account.
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <>
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
                        <div>
                          <Link
                            href="#"
                            className="text-xs dark:text-gray-400 hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                      </>
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
              Don't have an account?&nbsp;
              <Link
                className="dark:text-white hover:underline font-semibold"
                href="/auth/signup"
              >
                Sign up
              </Link>
            </div>
            <div className="text-xs dark:text-gray-400 text-center mt-4">
              <Link
                className="dark:text-white hover:underline font-semibold"
                href="/employer/auth/signin"
              >
                Or sign in as Employer
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Signin
