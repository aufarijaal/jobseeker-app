import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { BellIcon, TriangleDownIcon } from '@radix-ui/react-icons'
import axios from '@/lib/axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import { useAuth } from '@/context/authContext'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'

function NavbarItemRightSide() {
  const { user, signout, loading, status } = useAuth()

  return (
    <ul className="flex gap-4 items-center">
      {/* Language selection */}
      <li></li>

      {user && !loading ? (
        <>
          {/* Notifications */}
          <li className="mr-2">
            <Popover>
              <PopoverTrigger className="flex items-center">
                <BellIcon className="h-4 w-4" />
              </PopoverTrigger>
              <PopoverContent className="border-border p-1 w-[400px]">
                <ScrollArea className="h-[300px] w-full pr-2">
                  {/* <div className="flex flex-col gap-1">
                    {Array.from({ length: 10 }, () => {
                      return (
                        <Alert className="border-border">
                          <BellIcon className="h-4 w-4" />
                          <AlertTitle className="text-sm font-bold">
                            Heads up!
                          </AlertTitle>
                          <AlertDescription className="text-xs">
                            You can add components and dependencies to your app
                            using the cli.
                          </AlertDescription>
                        </Alert>
                      )
                    })}
                  </div> */}
                  <div className="text-sm dark:text-gray-400 grid place-items-center mt-10">
                    No notifications.
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </li>

          {/* Profile */}
          <li>
            <Popover>
              <PopoverTrigger>
                <div className="flex gap-1 items-center">
                  <span className="dark:text-gray-300">{user.email}</span>
                  <TriangleDownIcon />
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0 border-border w-max min-w-[150px]">
                <div className="p-2">
                  <div className="text-xs font-semibold">{user.fullName}</div>
                  <div className="text-xs dark:text-gray-400">{user.email}</div>
                </div>
                <div className="h-px w-full dark:bg-border"></div>
                <div className="p-1">
                  <Link
                    className="text-sm p-2 w-full justify-start"
                    href="/account/profile"
                  >
                    Profile
                  </Link>
                </div>
                <div className="p-1">
                  <Link
                    className="text-sm p-2 w-full justify-start"
                    href="/account/settings"
                  >
                    Account Settings
                  </Link>
                </div>
                <div className="p-1">
                  <Button
                    variant="destructive"
                    className="text-sm p-2 w-full justify-start"
                    onClick={signout}
                  >
                    Sign out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </li>
        </>
      ) : !user && !loading ? (
        <>
          <li>
            <Link
              className="dark:text-gray-300 dark:hover:text-white"
              href="/auth/signin"
            >
              Sign in
            </Link>
          </li>
          <li>
            <Link
              className="dark:text-gray-300 dark:hover:text-white"
              href="/auth/signup"
            >
              Sign up
            </Link>
          </li>
        </>
      ) : (
        <>
          <Skeleton className="h-[20px] w-[20px] rounded-full" />
          <Skeleton className="h-[16px] w-[100px] rounded-lg" />
        </>
      )}

      {/* <li>
      <EmployerLinkNavbarItem />
    </li> */}
    </ul>
  )
}

export default NavbarItemRightSide
