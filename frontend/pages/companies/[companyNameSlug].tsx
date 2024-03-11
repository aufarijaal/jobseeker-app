import { JobCardAlt } from '@/components/job-card-alt'
import Navbar from '@/components/navbar'
import { ExternalLinkIcon } from '@radix-ui/react-icons'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import React from 'react'
import axios from '@/lib/axios'
import Head from 'next/head'
import { generateCompanyLogoUrl } from '@/lib/utils'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const result = await axios.get(`/companies/${ctx.params?.companyNameSlug}`)

  return {
    props: {
      company: result.data.data,
    },
  }
}

const CompanyDetailPage = ({company}: any) => {

  return (
    <>
      <Head>
        <title>{company.name} | JobSeeker</title>
      </Head>
      <main className="pt-20">
        {/* grid lg:grid-cols-[auto_450px] md:grid-cols-1 gap-10 */}
        <div className="max-w-7xl mx-auto px-4 pb-10 grid lg:grid-cols-[auto_450px] md:grid-cols-1 gap-10">
          <div id="company-detail">
            <div className="flex gap-4">
              <div>
                <img
                src={generateCompanyLogoUrl(company.logo)}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{company.name}</h2>
                {/* <Link
                  href="#"
                  className="text-sm dark:text-gray-400 flex items-center gap-2 hover:underline mt-2"
                >
                  Company website
                  <ExternalLinkIcon />
                </Link> */}
              </div>
            </div>

            <div className="h-px dark:bg-border w-full"></div>

            <div className="mt-5">
              <h3 className="font-bold">Company overview</h3>
              <p className="mt-2 text-sm max-w-[800px]">
                {company.about}
              </p>
            </div>

            <div className="mt-10">
              <h3 className="font-bold">Office location</h3>
              <div className="max-w-[800px] mt-2 text-sm">{company.location}</div>
            </div>

            <div className="mt-10">
              <h3 className="font-bold">Industry</h3>
              <div className="max-w-[800px] mt-2 text-sm">{company.industry}</div>
            </div>

            <div className="mt-10">
              <h3 className="font-bold">Company team</h3>
              <div className="mt-2 grid grid-cols-2 w-max gap-2">
                <div className="company-team-member border border-border w-max h-max rounded-md p-2 px-4 flex gap-4">
                  <img
                    className="rounded-full w-10 h-10"
                    src="https://i.pravatar.cc/150?img=2"
                    alt="company team member"
                  />
                  <div>
                    <div className="font-semibold text-sm">John Doe</div>
                    <div className="text-sm dark:text-gray-400">CEO</div>
                  </div>
                </div>

                <div className="company-team-member border border-border w-max h-max rounded-md p-2 px-4 flex gap-4">
                  <img
                    className="rounded-full w-10 h-10"
                    src="https://i.pravatar.cc/150?img=2"
                    alt="company team member"
                  />
                  <div>
                    <div className="font-semibold text-sm">John Doe</div>
                    <div className="text-sm dark:text-gray-400">CEO</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="company-jobs">
            <h3 className="font-bold text-lg">Active jobs</h3>
            <div className="mt-4 flex flex-col gap-2">
              {company.Job.map((job: any) => {
                return (
                  <JobCardAlt
                    key={job.id}
                    jobInfo={{
                      id: job.id,
                      title: job.title,
                      companyImageUrl: generateCompanyLogoUrl(company.logo),
                      companyTitle: company.name,
                      salary: job.salary,
                      location: job.location,
                      lastActive: job.createdAt,
                      savedStatus: false,
                    }}
                  />
                )
              })}

              {!company.Job.length && <div className="text-xs dark:text-gray-400 text-center text-wrap">Currently {company.name} doesn’t have active job openings. Check again soon!</div>}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default CompanyDetailPage
