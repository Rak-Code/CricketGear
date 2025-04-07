type AuthStateChangeCallback = (user: any | null) => void

// Demo credentials:
// Regular user: user@example.com / password
// Admin user: admin@example.com / password

// Store the current user in memory for demo purposes
let currentUser: any = null

export function onAuthStateChanged(callback: AuthStateChangeCallback) {
  // If we already have a user in memory, return it immediately
  if (currentUser) {
    setTimeout(() => {
      callback(currentUser)
    }, 0)
  } else {
    // Otherwise, return null (not logged in)
    setTimeout(() => {
      callback(null)
    }, 0)
  }

  // Return a mock unsubscribe function
  return () => {}
}

export async function signIn(email: string, password: string) {
  // Simulate authentication delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (email === "admin@example.com" && password === "password") {
    currentUser = {
      uid: "admin123",
      email: "admin@example.com",
      displayName: "Admin User",
      photoURL: "/placeholder.svg?height=40&width=40",
      isAdmin: true,
    }
    return {
      user: currentUser,
    }
  }

  if (email === "user@example.com" && password === "password") {
    currentUser = {
      uid: "user123",
      email: "user@example.com",
      displayName: "Demo User",
      photoURL: "/placeholder.svg?height=40&width=40",
      isAdmin: false,
    }
    return {
      user: currentUser,
    }
  }

  throw new Error("Invalid email or password")
}

export async function signUp(email: string, password: string, displayName: string) {
  // Simulate registration delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  currentUser = {
    uid: "newuser123",
    email,
    displayName,
    photoURL: null,
    isAdmin: false,
  }

  return {
    user: currentUser,
  }
}

export async function signOut() {
  // Simulate sign out delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  currentUser = null
  return true
}

export async function resetPassword(email: string) {
  // Simulate password reset delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return true
}

