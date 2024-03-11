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
import Head from 'next/head'
import axios from '@/lib/axios'

const Signup = () => {
  const [showpass, setshowpass] = useState(false)
  const [showpassconfirm, setshowpassconfirm] = useState(false)

  const formSchema = z
    .object({
      fullName: z.string().min(1).trim(),
      email: z.string().min(1).email().trim(),
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

  async function onSubmit() {
    const result = await axios.post('/auth/signup', form.getValues())
  }

  return (
    <>
      <Head>
        <title>Job Seeker Sign up</title>
      </Head>
      <main className="min-h-screen w-full grid place-items-center">
        <div className="w-[400px]">
          <div className="mb-8 text-center space-y-4">
            <div className="text-3xl font-semibold">Sign up</div>
            <div className="text-sm dark:text-gray-500">
              Create a new account.
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        required
                        placeholder="John Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          variant="secondary"
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
                name="passwordConfirm"
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
                          variant="secondary"
                          onClick={() => setshowpassconfirm(!showpassconfirm)}
                        >
                          {showpassconfirm ? (
                            <EyeClosedIcon />
                          ) : (
                            <EyeOpenIcon />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" variant="secondary">
                Submit
              </Button>
            </form>
          </Form>
          <div>
            <div className="text-xs dark:text-gray-400 text-center mt-6">
              Already have an account?&nbsp;
              <Link
                className="dark:text-white hover:underline font-semibold"
                href="/auth/signin"
              >
                Sign in
              </Link>
            </div>
            <div className="text-xs dark:text-gray-400 text-center mt-2">
              <Link
                className="dark:text-white hover:underline font-semibold"
                href="/employer/auth/signup"
              >
                Or sign up as Employer
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Signup
