import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase, Database } from '../lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  updateProfile: (profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state...')
    
    const initializeAuth = async () => {
      try {
        console.log('AuthProvider: Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('AuthProvider: Error getting session:', error)
          setLoading(false)
          return
        }
        
        console.log('AuthProvider: Initial session result:', session)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('AuthProvider: User found, fetching profile for:', session.user.id)
          await fetchProfile(session.user.id)
        } else {
          console.log('AuthProvider: No user found, setting loading to false')
          setLoading(false)
        }
      } catch (error) {
        console.error('AuthProvider: Error in initializeAuth:', error)
        setLoading(false)
      }
    }
    
    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider: Auth state changed:', event, session)
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    console.log('AuthProvider: Fetching profile for user:', userId)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      console.log('AuthProvider: Profile fetch result:', { data, error })
      
      if (error) {
        console.error('AuthProvider: Error fetching profile:', error)
        console.log('AuthProvider: No profile found, user needs to complete setup')
        setProfile(null)
      } else {
        setProfile(data || null)
        console.log('AuthProvider: Profile set:', data || 'null')
      }
    } catch (error) {
      console.error('AuthProvider: Unexpected error fetching profile:', error)
      setProfile(null)
    } finally {
      console.log('AuthProvider: Setting loading to false')
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    console.log('AuthProvider: Signing up user:', email)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Signing in user:', email)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signInWithGoogle = async () => {
    console.log('AuthProvider: Signing in with Google')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`
      }
    })
    return { error }
  }

  const signOut = async () => {
    console.log('AuthProvider: Signing out')
    await supabase.auth.signOut()
    setProfile(null)
  }

  const updateProfile = async (profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      return { error: new Error('No user logged in') }
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        return { error }
      }

      // Refresh profile data
      await fetchProfile(user.id)
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}