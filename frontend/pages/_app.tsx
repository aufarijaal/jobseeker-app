import { ThemeProvider } from '@/components/theme-provider'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { GeistSans } from 'geist/font/sans'
import Navbar from '@/components/navbar'
import { usePathname } from 'next/navigation'
import { Toaster } from '@/components/ui/sonner'
import Layout from '@/components/layout'
import { AuthProvider } from '@/context/authContext'
// import { appWithTranslation } from 'next-i18next'
// import { Inter } from 'next/font/google'

// const inter = Inter({
//   weight: ['400', '500', '600', '700', '800'],
//   display: 'swap',
//   variable: '--font-inter',
//   subsets: ['latin'],
// })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style global jsx>
        {`
          html {
            font-family: ${GeistSans.style.fontFamily};
          }
        `}
      </style>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          enableSystem
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <Layout>
            {/* <div className={`${inter.variable} font-sans`}> */}
            <div className={`${GeistSans.variable} font-sans`}>
              <Component {...pageProps} />
            </div>
            <Toaster/>
          </Layout>
        </ThemeProvider>
      </AuthProvider>
    </>
  )
}

// export default appWithTranslation(MyApp /*, nextI18NextConfig */)
export default MyApp
