"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/lib/types"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { app } from "@/lib/firebase/firebase"

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  loading: boolean
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  debugAdminStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hardcoded admin UID for development
const ADMIN_UID = 'oXEuez09HpYpV7Ok6F6dZsJoUIR2';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshToken = async () => {
    const auth = getAuth(app)
    const currentUser = auth.currentUser
    if (currentUser) {
      try {
        // Force token refresh
        await currentUser.getIdToken(true)
        const idTokenResult = await currentUser.getIdTokenResult()
        
        // Check for admin status in multiple ways
        let isAdmin = false;
        let adminSource = '';
        
        // 1. Check custom claims
        if (idTokenResult.claims.admin === true) {
          isAdmin = true;
          adminSource = 'custom_claims';
          console.log("Admin status from custom claims: true");
        }
        
        // 2. Check specific UID (for development only)
        if (process.env.NODE_ENV === 'development' && currentUser.uid === ADMIN_UID) {
          isAdmin = true;
          adminSource = 'development_uid';
          console.log("Admin status set to true for development UID");
        }
        
        console.log("Token refreshed:", {
          uid: currentUser.uid,
          email: currentUser.email,
          isAdmin,
          adminSource,
          claims: idTokenResult.claims,
          environment: process.env.NODE_ENV
        })

        setUser(prev => {
          if (!prev) return null
          return {
            ...prev,
            isAdmin,
            adminSource
          }
        })
      } catch (error) {
        console.error("Error refreshing token:", error)
        // Don't update user state on error to maintain previous admin status
      }
    }
  }

  const debugAdminStatus = async () => {
    const auth = getAuth(app)
    const currentUser = auth.currentUser
    if (currentUser) {
      try {
        const idTokenResult = await currentUser.getIdTokenResult(true)
        console.log("Debug Admin Status:", {
          uid: currentUser.uid,
          email: currentUser.email,
          isAdmin: idTokenResult.claims.admin === true || currentUser.uid === ADMIN_UID,
          claims: idTokenResult.claims,
          currentUserState: user
        })
      } catch (error) {
        console.error("Error debugging admin status:", error)
      }
    } else {
      console.log("No user logged in")
    }
  }

  useEffect(() => {
    const auth = getAuth(app)
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          // Force refresh to get the latest claims
          const idTokenResult = await authUser.getIdTokenResult(true)
          
          // Check for admin status in multiple ways
          let isAdmin = false;
          
          // 1. Check custom claims
          if (idTokenResult.claims.admin === true) {
            isAdmin = true;
            console.log("Admin status from custom claims: true");
          }
          
          // 2. Check specific UID (for development)
          if (authUser.uid === ADMIN_UID) {
            isAdmin = true;
            console.log("Admin status set to true for specific UID");
          }
          
          console.log("Auth state changed:", {
            uid: authUser.uid,
            email: authUser.email,
            isAdmin,
            claims: idTokenResult.claims
          })

          setUser({
            uid: authUser.uid,
            email: authUser.email || "",
            displayName: authUser.displayName || "User",
            photoURL: authUser.photoURL || undefined,
            isAdmin,
          })
        } catch (error) {
          console.error("Error in auth state change:", error)
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    try {
      const auth = getAuth(app)
      await signOut(auth)
      setUser(null)
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.isAdmin || false,
        loading,
        logout,
        refreshToken,
        debugAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

