import * as React from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'

export function EmployerLinkNavbarItem() {
  return (
    <Select>
      <SelectTrigger className="h-7 text-xs w-max">
        <SelectValue placeholder="For employers" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">
          <Link
            href="/employer/auth/signin"
            className="font-sans w-full h-full"
          >
            Sign in
          </Link>
        </SelectItem>
        <SelectItem value="2">
          <Link href="/employer/auth/signup">Sign up</Link>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
