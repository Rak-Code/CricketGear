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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth(app)
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Force refresh to get the latest claims
        const idTokenResult = await authUser.getIdTokenResult(true);
        
        let isAdmin = false; // Initialize isAdmin

        // --- Development Only: Static Admin User Check ---
        if (authUser.email === 'admin@example.com') {
          isAdmin = true;
          console.warn("DEVELOPMENT MODE: User admin@example.com is granted admin privileges statically.");
        } else {
          // --- Production Logic: Check Custom Claims ---
          isAdmin = idTokenResult.claims.admin === true; 
        }
        // ------------------------------------------------

        setUser({
          uid: authUser.uid,
          email: authUser.email || "",
          displayName: authUser.displayName || "User",
          photoURL: authUser.photoURL || undefined,
          isAdmin: isAdmin, // Set isAdmin based on the logic above
        })
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
      // Force a page refresh after logout to clear any state
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

