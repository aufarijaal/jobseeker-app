import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import React, { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ResetIcon } from '@radix-ui/react-icons'

type Props = {
  value?: string
  onValueChange?: (value: string) => void
  onReset: () => void
}

function JobCategoriesDropdown({ value, onValueChange, onReset }: Props) {
  const [jobCategories, setjobCategories] = useState<any>()

  async function getJobCategories() {
    const result = await axios.get('/job-categories/for-dropdown')

    setjobCategories(result.data)
  }

  useEffect(() => {
    getJobCategories()
  }, [])

  return jobCategories ? (
    <div className="flex gap-1">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Job category" />
        </SelectTrigger>
        <SelectContent>
          {jobCategories.map((jobCategory: any) => {
            return (
              <SelectItem value={jobCategory.slug} title={jobCategory.slug} key={jobCategory.slug}>
                {jobCategory.name}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      <Button onClick={onReset} variant="secondary">
        <ResetIcon/>
      </Button>
    </div>
  ) : (
    <Skeleton className="h-[36px] w-[180px] rounded-md" />
  )
}

export default JobCategoriesDropdown
