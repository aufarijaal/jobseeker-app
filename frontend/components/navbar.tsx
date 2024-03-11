import * as React from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import NavbarItemRightSide from './navbar-item-right-side'
// import { EmployerLinkNavbarItem } from './employer-link-navbar-item'

export default function Navbar() {
  return (
    <nav
      className="bg-background w-full h-[50px] border-b border-border text-xs font-semibold fixed top-0 left-0 px-4"
      id="navbar"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
        <div id="left-side" className="h-max">
          <ul className="flex gap-4 items-center">
            <li>
              <Link
                className="dark:text-gray-300 dark:hover:text-white"
                href="/"
              >
                <img src="/github.svg" width="24" height="24" />
              </Link>
            </li>
            <li>
              <Link
                className="dark:text-gray-300 dark:hover:text-white"
                href="/"
              >
                Jobs
              </Link>
            </li>
            <li>
              <Link
                className="dark:text-gray-300 dark:hover:text-white"
                href="/companies"
              >
                Companies
              </Link>
            </li>
          </ul>
        </div>

        <div id="right-side" className="h-max">
          <NavbarItemRightSide />
        </div>
      </div>
    </nav>
  )
}
