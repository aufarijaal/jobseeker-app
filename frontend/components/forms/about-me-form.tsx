import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

function AboutMeForm() {
  const [value, setValue] = useState('')

  return (
    <div className="mt-2">
      <div className="grid w-full max-w-[600px] gap-1.5 mb-4">
        <Label htmlFor="bio" className="text-md font-bold">
          Your Bio
        </Label>
        <Textarea
          placeholder="Max 200 character"
          id="bio"
          maxLength={200}
          value={value}
          onInput={(e) => setValue(e.currentTarget.value)}
        />
        <p className="text-sm text-muted-foreground">{value.length} / 200</p>
      </div>

      <Button className="w-max" variant="secondary">
        Submit
      </Button>
    </div>
  )
}

export default AboutMeForm
