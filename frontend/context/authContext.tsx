import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import axios from '@/lib/axios'
import { AxiosError } from 'axios'
import { cookies } from 'next/headers'
import { useRouter } from 'next/router'

type User = {
  id: number
  fullName: string
  email: string
}

type Signin = (args: { email: string; password: string }) => Promise<void>
type Signup = (args: {
  name: string
  email: string
  password: string
}) => Promise<void>
type Signout = () => Promise<void>
type GetUser = () => Promise<void>

interface ContextProps {
  user?: User | null
  signin: Signin
  signup: Signup
  signout: Signout
  status: undefined | 'loggedOut' | 'loggedIn',
  loading: boolean
}

const AuthContext = createContext({} as ContextProps)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>()
  const [status, setStatus] = useState<undefined | 'loggedOut' | 'loggedIn'>()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const signin = useCallback<Signin>(async (credentials) => {
    try {
      setLoading(true)
      const result = await axios.post('/auth/signin', credentials)

      if (result.status === 200) {
        setStatus('loggedIn')
        getMe()
        router.push('/')
      } else {
        throw new Error('Invalid sign in.')
      }
    } catch (error: unknown) {
      setUser(null)
      throw new Error('An error occurred while attempting to sign in.')
    } finally {
      setLoading(false)
    }
  }, [])

  const signup = useCallback<Signup>(async (credentials) => {
    try {
      setLoading(true)
      const result = await axios.post('/auth/signup', credentials)
      
      if (result.status === 200) {
        setStatus('loggedIn')
        getMe()
        router.push('/')
      } else {
        throw new Error('Invalid sign up.')
      }
    } catch (error: unknown) {
      setUser(null)
      throw new Error('An error occurred while attempting to sign up.')
    } finally {
      setLoading(false)
    }
  }, [])

  const signout = useCallback<Signout>(async () => {
    await axios.post('/auth/signout')

    setStatus('loggedOut')
    setUser(null)
    router.push('/auth/signin')
  }, [])

  const getMe = useCallback(async () => {
    try {
      setLoading(true)
      const result = await axios.get('/account/me')

      if (result.data.data) {
        setUser(result.data.data)
        setStatus('loggedIn')
      } else {
        setUser(null)
        setStatus(undefined)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getMe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, signin, signup, signout, status, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
