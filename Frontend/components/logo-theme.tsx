"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function LogoWithTheme() {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Link href="/" className="flex items-center gap-2">
                <div className="h-12 w-12 bg-transparent" />
                <h1 className="text-xl font-bold hidden sm:block">LinkJob</h1>
            </Link>
        )
    }

    const logoSrc = resolvedTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png'

    return (
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-12 w-12 relative">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={resolvedTheme}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Image
                            src={logoSrc}
                            alt="LinkJob Logo"
                            width={48}
                            height={48}
                            priority
                            className="h-12 w-12"
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
            <h1 className="text-xl font-bold hidden sm:block">LinkJob</h1>
        </Link>
    )
}