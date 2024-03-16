import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import {
  BookmarkIcon,
  ClockIcon,
  DrawingPinIcon,
  IdCardIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { JobCard } from '@/components/job-card'
import { Skeleton } from '@/components/ui/skeleton'
import { GetServerSideProps } from 'next'
import axios from '@/lib/axios'
import Head from 'next/head'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { toast } from 'sonner'
import JobCategoriesDropdown from '@/components/job-categories-dropdown'
import { useAuth } from '@/context/authContext'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatLastActive } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { AxiosError } from 'axios'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const result = await axios.get('/jobs', {
      params: {
        sortBy: ctx.query.sortBy,
        q: ctx.query.q,
        page: 1,
        jobCategory: ctx.query.jobCategory,
      },
      headers: {
        Authorization: ctx.req.cookies.accessToken,
      },
    })

    return {
      props: {
        jobs: result.data.data,
      },
    }
  } catch (error) {
    return {
      redirect: {
        destination: '/auth/signin',
      },
      props: {
        jobs: [],
      },
    }
  }
}

export default function Home({ jobs }: any) {
  const { status } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const [jobCategory, setJobCategory] = useState(
    params.get('jobCategory') ?? ''
  )
  const [sortBy, setSortBy] = useState(params.get('sortBy') ?? '')
  const [isEmpty, setIsEmpty] = useState(true)
  const [loading, setLoading] = useState(true)
  const [firstTimeFetched, setFirstTimeFetched] = useState(true)
  const [currentPage, setCurrentPage] = useState(2)
  const [jobsData, setJobsData] = useState(jobs)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [tab, setTab] = useState<'explore' | 'applied' | 'saved'>('explore')
  const [appliedJobs, setAppliedJobs] = useState([])
  const [savedJobs, setSavedJobs] = useState([])

  function handleSearchAndFilter() {
    try {
      setLoading(true)
      const query: Record<string, string> = {}

      // set sortBy if its exist, not null, and not an empty string
      if (sortBy !== null && sortBy !== '') {
        query.sortBy = sortBy
      }

      // set jobCategory if its exist, not null, and not an empty string
      if (jobCategory !== null && jobCategory !== '') {
        query.jobCategory = jobCategory
      }

      // and this too
      if (q !== null && q !== '') {
        query.q = q
      }

      router.push({
        pathname: '/',
        query: {
          ...router.query,
          ...query,
        },
      })
    } catch (error: any) {
      toast(error)
    } finally {
      setLoading(false)
      setFirstTimeFetched(false)
    }
  }

  async function loadMore() {
    setCurrentPage((prev) => prev + 1)

    const result = await axios.get('/jobs', {
      params: {
        sortBy,
        q: params.get('q'),
        page: currentPage,
        jobCategory,
      },
    })

    setHasNextPage(result.data.hasNextPage)
    setJobsData([...jobsData, ...result.data.data])
  }

  async function getAppliedJobs() {
    try {
      if (status === 'loggedIn') {
        const result = await axios.get('/applications')

        setAppliedJobs(result.data.data)
      }
    } catch (error: any) {
      toast(error.message)
    }
  }

  async function getSavedJobs() {
    try {
      if (status === 'loggedIn') {
        const result = await axios.get('/saved-jobs')

        setSavedJobs(result.data.data)
      }
    } catch (error: any) {
      toast(error.message)
    }
  }

  useEffect(() => {
    getAppliedJobs()
    getSavedJobs()
    setLoading(false)
  }, [])

  useEffect(() => {
    if (tab === 'applied') {
      getAppliedJobs()
    } else if (tab === 'explore') {
      getSavedJobs()
    } else {
      handleSearchAndFilter()
    }
    setLoading(false)
  }, [tab])

  useEffect(() => {
    setJobsData(jobs)
  }, [params])

  return (
    <>
      <Head>
        <title>JobSeeker</title>
      </Head>
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Carousel / Hero*/}
          <div id="hero" className="mt-16 flex flex-col items-center gap-4">
            <img
              src="/jobseeker_logo.svg"
              width="32"
              height="32"
              alt="brand logo"
            />
            <h1 className="font-bold text-3xl md:text-6xl text-center">
              Start reach your success!
            </h1>
            <h5 className="text-sm md:text-xl text-gray-400 text-center max-w-[600px]">
              The best job seeking platform providing various job vacancies to
              help you start reach your career path.
            </h5>
          </div>

          {/* tabs Explore, Applied, and (Saved soon) */}
          <div className="mt-10">
            <ul className="flex gap-5">
              <li>
                <Button
                  className={`font-semibold dark:text-gray-400 dark:hover:text-white ${
                    tab === 'explore' ? 'dark:text-white underline' : ''
                  }`}
                  onClick={() => setTab('explore')}
                  variant="link"
                >
                  Explore
                </Button>
              </li>
              <li>
                <Button
                  className={`font-semibold dark:text-gray-400 dark:hover:text-white ${
                    tab === 'applied' ? 'dark:text-white underline' : ''
                  }`}
                  onClick={() => setTab('applied')}
                  variant="link"
                >
                  Applied
                </Button>
              </li>
              <li>
                <Button
                  className={`font-semibold dark:text-gray-400 dark:hover:text-white ${
                    tab === 'saved' ? 'dark:text-white underline' : ''
                  }`}
                  onClick={() => setTab('saved')}
                  variant="link"
                >
                  Saved
                </Button>
              </li>
            </ul>
          </div>
          <div className="h-px dark:bg-border mb-4 mt-2"></div>
          {tab === 'explore' ? (
            <>
              {/* search feature & filtering */}
              <div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Input
                      id="name"
                      placeholder="Search by job title or company name"
                      value={q}
                      onInput={(e) => setQ(e.currentTarget.value)}
                      onKeyUp={(e) => {
                        if (e.key === 'Enter') handleSearchAndFilter()
                      }}
                    />
                    <Button onClick={() => handleSearchAndFilter()}>
                      <MagnifyingGlassIcon />
                    </Button>
                  </div>
                  <div className="flex gap-4 w-full">
                    <Select
                      value={params.get('sortBy') ?? 'mostRelevant'}
                      onValueChange={(v) => {
                        const query: Record<string, string> = {
                          sortBy: v,
                        }

                        if (q !== null && q !== '') {
                          query.q = q
                        }

                        if (jobCategory !== null && jobCategory !== '') {
                          query.jobCategory = jobCategory
                        }

                        router.push({
                          pathname: '/',
                          query: {
                            ...router.query,
                            ...query,
                          },
                        })
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mostRelevant">
                          Most Relevant
                        </SelectItem>
                        <SelectItem value="highestSalary">
                          Highest Salary
                        </SelectItem>
                        <SelectItem value="recentlyPosted">
                          Recently Posted
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <JobCategoriesDropdown
                      value={params.get('jobCategory') ?? undefined}
                      onValueChange={(v) => {
                        const query: Record<string, string> = {
                          jobCategory: v,
                        }

                        if (q !== null && q !== '') {
                          query.q = q
                        }

                        if (sortBy !== null && sortBy !== '') {
                          query.sortBy = sortBy
                        }

                        router.push({
                          pathname: '/',
                          query: {
                            ...router.query,
                            ...query,
                          },
                        })
                      }}
                      onReset={() => {
                        delete router.query.jobCategory
                        router.push({
                          pathname: '/',
                          query: {
                            ...router.query,
                          },
                        })
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* job posts list */}
              <div className="mt-10 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 pb-10">
                {!jobsData && loading ? (
                  <Skeleton className="w-[405px] h-[238px] rounded-xl" />
                ) : (
                  jobsData.map((job: any) => {
                    return (
                      <JobCard
                        jobInfo={job}
                        key={job.id}
                        afterToggling={handleSearchAndFilter}
                      />
                    )
                  })
                )}
              </div>

              {!jobsData.length && !loading && (
                <div className="text-center dark:text-gray-400 text-sm w-full mb-10 h-[calc(100vh-500px)]">
                  No Results
                </div>
              )}

              {jobsData.length && hasNextPage ? (
                <div className="flex justify-center pb-20">
                  <Button onClick={loadMore}>Load more</Button>
                </div>
              ) : null}
            </>
          ) : tab === 'applied' ? (
            <div className="mt-10 pb-10 min-h-screen">
              {status === 'loggedOut' ||
                (!status && (
                  <div className="text-center">
                    <Link
                      className="dark:text-gray-200 font-bold underline"
                      href="/auth/signin"
                    >
                      Sign in&nbsp;
                    </Link>
                    to see your applied jobs.
                  </div>
                ))}

              {appliedJobs.length ? (
                appliedJobs.map((applied: any) => {
                  return (
                    <Link href={`/job/${applied.jobId}`}>
                      <Card className="w-full flex-shrink-0 dark:border-border dark:hover:border-gray-600 transition-colors cursor-pointer rounded-md">
                        <CardHeader className="p-4">
                          <div className="flex gap-4 items-center">
                            <div>
                              <img
                                src={`http://localhost:3001/company-logos/${applied.job.company.logo}`}
                                className="w-10 h-10 object-contain"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <CardTitle className="text-md">
                                {applied.job.title}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {applied.job.company.name}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="flex flex-col gap-2 text-gray-300 text-xs font-semibold">
                            <li className="flex gap-4 items-center">
                              <IdCardIcon />
                              <span>{applied.job.salary}</span>
                            </li>
                            <li className="flex gap-4 items-center">
                              <DrawingPinIcon />
                              <span>{applied.job.location}</span>
                            </li>
                          </ul>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center dark:text-gray-400 text-xs p-4">
                          <Badge variant="secondary">{applied.status}</Badge>
                        </CardFooter>
                      </Card>
                    </Link>
                  )
                })
              ) : (
                <div>You don't have any applied jobs.</div>
              )}
            </div>
          ) : (
            <>
              <div className="mt-10 pb-10 min-h-screen flex flex-col gap-2">
                {savedJobs.map((savedJob: any) => {
                  return (
                    <Link href={`/job/${savedJob.id}`}>
                      <Card className="w-full flex-shrink-0 dark:border-border dark:hover:border-gray-600 transition-colors cursor-pointer rounded-md">
                        <CardHeader className="p-4">
                          <div className="flex gap-4 items-center">
                            <div>
                              <img
                                src={`http://localhost:3001/company-logos/${savedJob.job.company.logo}`}
                                className="w-10 h-10 object-contain"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <CardTitle className="text-md">
                                {savedJob.job.title}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {savedJob.job.company.name}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="flex flex-col gap-2 text-gray-300 text-xs font-semibold">
                            <li className="flex gap-4 items-center">
                              <IdCardIcon />
                              <span>{savedJob.job.salary}</span>
                            </li>
                            <li className="flex gap-4 items-center">
                              <DrawingPinIcon />
                              <span>{savedJob.job.location}</span>
                            </li>
                          </ul>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center dark:text-gray-400 text-xs p-4">
                          <div className="flex gap-2 items-center text-xs">
                            <ClockIcon />
                            {'Posted ' + savedJob.job.createdAt}
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
