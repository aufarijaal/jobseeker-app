import { JobCard } from '@/components/job-card'
import { JobCardAlt } from '@/components/job-card-alt'
import Navbar from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { BookmarkIcon, DrawingPinIcon, IdCardIcon } from '@radix-ui/react-icons'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import React, { useState } from 'react'
import axios from '@/lib/axios'
import { generateCompanyLogoUrl } from '@/lib/utils'
import Head from 'next/head'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const jobDetailResult = await axios.get(`/jobs/${ctx.params?.jobId}`)
  const similarJobsResult = await axios.get(
    `/jobs/${ctx.params?.jobId}/get-similar`
  )
  const moreJobsCompany = await axios.get(
    `/jobs/${ctx.params?.jobId}/get-more-jobs-from-related-company`
  )

  return {
    props: {
      job: jobDetailResult.data.data,
      similarJobs: similarJobsResult.data.data,
      moreJobsCompany: moreJobsCompany.data.data,
    },
  }
}

export default function JobDetailPage({
  job,
  similarJobs,
  moreJobsCompany,
}: any) {
  const [showmore, setshowmore] = useState(false)

  async function applyJob() {
    
  }

  return (
    <>
      <Head>
        <title>
          {job.title} at {job.company.name} | JobSeeker
        </title>
      </Head>
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 pb-10 grid lg:grid-cols-[auto_450px] md:grid-cols-1 gap-10">
          <div id="job-detail">
            {/* brief */}
            <div className="flex gap-4">
              <div>
                <img
                  src={generateCompanyLogoUrl(job.company.logo)}
                  className="w-14 h-14 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h4 className="text-2xl font-bold">{job.title}</h4>
                <Link
                  className="text-gray-400"
                  href={`/companies/${job.company.slug}`}
                >
                  {job.company.name}
                </Link>

                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <IdCardIcon />
                    <div>{job.salary}</div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <DrawingPinIcon />
                    <div>{job.location}</div>
                  </div>
                </div>

                <div className="mt-6 justify-self-end flex gap-4">
                  <Button className="w-[150px]">Apply this job</Button>
                  <Button variant="secondary">
                    <BookmarkIcon className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>
            </div>

            <div className="h-px my-6 bg-border w-full"></div>

            {/* description (requirements, job desk) */}
            <div className="mt-4">
              <div>
                <h4 className="text-lg font-bold">Job Description</h4>
                <p className="text-sm mt-2 max-w-">{job.description}</p>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-bold">Requirements</h4>
                <ul className="mt-2 list-disc pl-8 text-sm">
                  {job.requirements.split('~').map((reqmnt: string) => {
                    return <li key={reqmnt}>{reqmnt}</li>
                  })}
                </ul>
              </div>
            </div>

            {/* company about */}
            <div className="mt-10 border border-border p-6 rounded-xl">
              <h4 className="text-lg font-bold">About company</h4>
              <div className="mt-6 flex gap-4">
                <div className="flex-shrink-0">
                  <img
                    className="w-16 h-16 object-contain"
                    src={generateCompanyLogoUrl(job.company.logo)}
                    alt="company logo"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Link
                    href={`/companies/${job.company.slug}`}
                    className="text-xl font-extrabold"
                  >
                    {job.company.name}
                  </Link>
                  <p
                    className={`text-sm dark:text-gray-300 leading-6 ${
                      showmore ? 'line-clamp-none' : 'line-clamp-3'
                    }`}
                  >
                    {job.company.about}
                  </p>
                  <Button
                    variant="ghost"
                    onClick={() => setshowmore(!showmore)}
                  >
                    {showmore ? 'Show less' : 'Show more'}
                  </Button>
                </div>
              </div>

              <h4 className="text-lg font-bold mt-8">Office location</h4>
              <div className="mt-2 flex gap-4 text-sm">
                {job.company.location}
              </div>
            </div>
          </div>

          {/* Similar jobs & More jobs from the related company */}
          <div>
            <div id="similar-jobs">
              <h3 className="font-bold text-lg">Similar jobs</h3>
              <div className="mt-4 flex flex-col gap-2">
                {similarJobs.map((similarJob: any) => {
                  return (
                    <JobCardAlt
                      key={similarJob.id}
                      jobInfo={{
                        id: similarJob.id,
                        title: similarJob.title,
                        companyImageUrl: generateCompanyLogoUrl(
                          similarJob.company.logo
                        ),
                        companyTitle: similarJob.company.name,
                        salary: similarJob.salary,
                        location: similarJob.location,
                        lastActive: similarJob.createdAt,
                        savedStatus: false,
                      }}
                    />
                  )
                })}

                {similarJobs.length === 0 && (
                  <div className="dark:text-gray-400 text-xs">
                    No similar jobs.
                  </div>
                )}
              </div>
            </div>

            <div className="h-px my-6 bg-border w-full"></div>

            <div id="more-jobs-from-company" className="mt-8">
              <h3 className="font-bold text-lg">
                More jobs from {job.company.name}
              </h3>
              <div className="mt-4 flex flex-col gap-2">
                {moreJobsCompany.map((job: any) => {
                  return (
                    <JobCardAlt
                      key={job.id}
                      jobInfo={{
                        id: job.id,
                        title: job.title,
                        companyImageUrl: generateCompanyLogoUrl(
                          job.company.logo
                        ),
                        companyTitle: job.company.name,
                        salary: job.salary,
                        location: job.location,
                        lastActive: job.createdAt,
                        savedStatus: false,
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
