import React, { useEffect, useState } from 'react'
import { Label } from '@/components//ui/label'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import {
  MagnifyingGlassIcon,
  Pencil1Icon,
  PlusIcon,
} from '@radix-ui/react-icons'
import { useDebounce } from 'use-debounce'
import axios from '@/lib/axios'
import TagItem from './skill-item'
import { Button } from './ui/button'
import { toast } from 'sonner'

interface Props {
  name: string
  id: string
  label: string
}

const SkillManagement: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [debouncedValue] = useDebounce(value, 500)
  const [skillsSearchResult, setSkillsSearchResult] = useState<
    { id: number; name: string; slug: string }[]
  >([])
  const [skillsFromDb, setSkillsFromDb] = useState<
    { id: number; name: string; slug: string }[]
  >([])
  const [initialskillsFromDb, setInitialSkillsFromDb] = useState<
    { id: number; name: string; slug: string }[]
  >([])
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)

  async function getSkillList() {
    const exceptionIdsParams = new URLSearchParams()

    skillsFromDb.forEach((item) => {
      exceptionIdsParams.append('exceptionIds', item.id.toString())
    })

    const result = await axios.get(
      `/misc/skills?q=${debouncedValue}&${exceptionIdsParams}`
    )

    setSkillsSearchResult(result.data.data)
  }

  async function getSkillFromDb() {
    const result = await axios.get('/misc/job-seeker-skills')

    setSkillsFromDb(
      result.data.data.map((item: any) => {
        return {
          id: item.skill.id,
          name: item.skill.name,
          slug: item.skill.slug,
        }
      })
    )
    setInitialSkillsFromDb(
      result.data.data.map((item: any) => {
        return {
          id: item.skill.id,
          name: item.skill.name,
          slug: item.skill.slug,
        }
      })
    )
  }

  async function submitChange() {
    try {
      setLoading(true)
      await axios.post('/misc/job-seeker-skills', {
        skills: [...skillsFromDb],
      })
      getSkillFromDb()
      setEditMode(false)
      toast('Skills updated successfully')
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  function removeItem(id: number) {
    setSkillsFromDb(skillsFromDb.filter((item) => item.id !== id))
  }

  function addItem(item: { id: number; name: string; slug: string }) {
    if (
      skillsFromDb.every(
        (skill) => JSON.stringify(skill) !== JSON.stringify(item)
      )
    ) {
      setSkillsFromDb((previous) => [...previous, item])
      setSkillsSearchResult([])
    }
  }

  function onCancel() {
    setSkillsFromDb(initialskillsFromDb)
    setEditMode(false)
  }

  useEffect(() => {
    if (debouncedValue !== '' && debouncedValue !== null) {
      getSkillList()
    }
  }, [debouncedValue])

  useEffect(() => {
    getSkillFromDb()
  }, [])

  return (
    <div>
      <Label htmlFor={props.id} className="text-md font-bold">
        {props.label}
      </Label>

      <div className="tag-list flex gap-2 mt-4 max-w-[500px] flex-wrap">
        {skillsFromDb.map((item) => {
          return (
            <TagItem
              key={`${item.id}-${item.name}`}
              isEditing={editMode}
              onRemoveBtnClick={() => removeItem(item.id)}
            >
              {item.name}
            </TagItem>
          )
        })}

        {!editMode && (
          <button
            className="text-xs dark:bg-green-600 w-max dark:hover:bg-green-500 transition-colors px-2.5 py-1 rounded-md select-none flex items-center gap-2 h-[27px]"
            onClick={() => setEditMode(true)}
          >
            <Pencil1Icon />
          </button>
        )}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            {editMode && (
              <button className="text-xs dark:bg-zinc-800 w-max dark:hover:bg-zinc-600 transition-colors px-2.5 py-1 rounded-md select-none flex items-center gap-2 h-[27px]">
                <PlusIcon />
              </button>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0 border-border">
            <div>
              <div className="flex items-center h-[40px] border-b border-border pl-4 gap-4">
                <MagnifyingGlassIcon className="flex-shrink-0" />
                <input
                  type="text"
                  className="w-full h-full rounded-tr-md bg-inherit placeholder:text-sm outline-none text-sm font-base"
                  placeholder="Search a skill name"
                  onInput={(e) => setValue(e.currentTarget.value)}
                />
              </div>

              <div className="tag-result-list p-1 max-h-[200px] overflow-y-auto">
                {debouncedValue &&
                skillsSearchResult.every((skill) => {
                  return (
                    skill.name.trim().toLowerCase() !==
                    debouncedValue.trim().toLowerCase()
                  )
                }) &&
                skillsFromDb.every((item) => {
                  return (
                    item.name.trim().toLowerCase() !==
                    debouncedValue.trim().toLowerCase()
                  )
                }) ? (
                  <button
                    className="tag-result-item"
                    onClick={() =>
                      addItem({
                        id: 0,
                        name: debouncedValue,
                        slug: '',
                      } as any)
                    }
                  >
                    {debouncedValue}
                    <sup className="dark:text-green-400 ml-1">new</sup>
                  </button>
                ) : null}
                {skillsSearchResult.map((skillSearchResult) => {
                  return (
                    <button
                      className="tag-result-item"
                      key={skillSearchResult.id}
                      title={skillSearchResult.slug}
                      onClick={() => addItem(skillSearchResult)}
                    >
                      {skillSearchResult.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {editMode && (
        <div className="mt-10 flex gap-2">
          <Button variant="secondary" onClick={submitChange} disabled={loading}>
            {loading ? 'Submitting' : 'Submit'}
          </Button>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}

export default SkillManagement
