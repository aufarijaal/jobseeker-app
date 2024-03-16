import React, { useEffect, useState } from 'react'
import { NextPage, GetServerSideProps } from 'next'
import axios from '@/lib/axios'
import Link from 'next/link'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/router'

const CompaniesPage: NextPage = () => {
  const [companies, setCompanies] = useState<any>()
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')
  const router = useRouter()

  async function getCompanies() {
    try {
      setLoading(true)
      let params: Record<string, string> = {}

      if (searchKeyword !== null && searchKeyword !== '') {
        params.q = searchKeyword
      }

      const result = await axios.get('/companies', {
        params,
      })

      setCompanies(result.data.data.companies)
    } catch (error: any) {
      toast(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCompanies()
  }, [])

  return (
    <>
      <Head>
        <title>Companies | JobSeeker</title>
      </Head>
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 pb-10">
          <div className="flex gap-2">
            <Input
              id="name"
              placeholder="Search by company name"
              value={searchKeyword}
              onInput={(e) => setSearchKeyword(e.currentTarget.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') getCompanies()
              }}
            />
            <Button onClick={() => {}}>
              <MagnifyingGlassIcon />
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10 mt-4">
            {companies &&
              !loading &&
              companies.map((company: any) => {
                return (
                  <Link
                    href={`/companies/${company.slug}`}
                    className="company-card border border-border rounded-xl p-6 bg-background w-full h-max flex justify-center flex-col items-center gap-2 dark:hover:border-gray-600 transition-colors"
                    key={company.slug}
                  >
                    <img
                      className="w-14 h-14 object-contain bg-white rounded-full"
                      src={company.logo}
                      alt="company logo"
                    />
                    <div className="line-clamp-1 max-w-full text-lg font-semibold">
                      {company.name}
                    </div>
                    <div className="line-clamp-1 max-w-full text-sm dark:text-gray-400">
                      {company.industry}
                    </div>
                  </Link>
                )
              })}

            {loading &&
              Array.from({ length: 10 }, (i) => {
                return <Skeleton className="w-full h-[170px] rounded-xl" />
              })}
          </div>

          {companies && !companies.length && !loading && (
            <div className="dark:text-gray-400 text-sm text-center w-full py-20">
              No results
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default CompaniesPage
