"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"

interface TokenPayload {
  sub: string
  role: string
  id: number
  exp: number
}

export default function withAuth<T extends Record<string, any>>(
  WrappedComponent: React.ComponentType<T>,
  allowedRoles: string[]
) {
  const WithAuth = (props: T) => {
    const router = useRouter()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
      const checkAuth = () => {
        const token = localStorage.getItem("token")
        if (!token) {
          router.replace("/auth/login")
          return
        }

        try {
          const decoded = jwtDecode<TokenPayload>(token)

          if (!decoded?.exp || decoded.exp * 1000 < Date.now()) {
            router.replace("/auth/login")
            return
          }

          if (!allowedRoles.includes(decoded.role)) {
            router.replace("/no-disponible")
            return
          }
        } catch (err) {
          router.replace("/auth/login")
          return
        }

        setChecking(false)
      }

      checkAuth()
    }, [router])

    return <WrappedComponent {...props} />
  }

  WithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`

  return WithAuth
}
