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
import Head from 'next/head'

const SuperAdminSignin = () => {
  const form = useForm()
  const [showpass, setshowpass] = useState(false)

  function onSubmit() {
    return
  }

  return (
    <>
      <Head>
        <title>Super Admin Sign In</title>
      </Head>
      <main className="min-h-screen w-full grid place-items-center">
        <div className="w-[300px]">
          <div className="mb-8 text-center space-y-4">
            <div className="text-3xl font-semibold">Super Admin Sign In</div>
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
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" variant="destructive">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </>
  )
}

export default SuperAdminSignin
