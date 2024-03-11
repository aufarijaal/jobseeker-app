import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

export function JobSearchCard() {
  return (
    <Card className="w-full">
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex">
              <Input id="name" placeholder="Name of your project" />
              <Button>
                <MagnifyingGlassIcon />
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
