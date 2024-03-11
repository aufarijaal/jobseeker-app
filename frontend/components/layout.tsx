import { usePathname } from 'next/navigation'
import React from 'react'
import Navbar from './navbar'
import Footer from './footer'

function Layout({children}: {children: React.ReactNode}) {
  const pathname = usePathname()
  const routesToExclude = [
    '/auth/signin',
    '/auth/signup',
    '/employer/auth/signin',
    '/employer/auth/signup',
    '/superadmin/dashboard',
    '/superadmin/signin',
  ]
  
  return (
    <div id="root-layout">
      {routesToExclude.includes(pathname) ? null : <Navbar />}
      {children}
      {routesToExclude.includes(pathname) ? null : <Footer />}
    </div>
  )
}

export default Layout