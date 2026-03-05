"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function AnimatedBackground({ variant = "default" }: { variant?: "default" | "dark" | "light" }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Before mount, use a safe default to avoid flash
  const isDark = mounted ? resolvedTheme === "dark" : true

  // If variant is explicitly "light", override
  const showDark = variant === "light" ? false : variant === "dark" ? true : isDark

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* Base */}
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{ background: showDark ? "#0D1F1B" : "#E8F5F0" }}
      />

      {/* Mesh blobs */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${showDark ? "#0A7764" : "#0A776440"} 0%, transparent 70%)`,
          opacity: showDark ? 0.3 : 0.5,
          top: "10%",
          left: "15%",
          animation: "mesh-move-1 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${showDark ? "#1A6EBF" : "#1A6EBF30"} 0%, transparent 70%)`,
          opacity: showDark ? 0.25 : 0.4,
          top: "40%",
          right: "10%",
          animation: "mesh-move-2 15s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[80px] transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${showDark ? "#12B88A" : "#12B88A30"} 0%, transparent 70%)`,
          opacity: showDark ? 0.2 : 0.35,
          bottom: "10%",
          left: "40%",
          animation: "mesh-move-3 18s ease-in-out infinite",
        }}
      />

      {/* Floating medical crosses */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: showDark ? 0.04 : 0.06 }} aria-hidden="true">
        <defs>
          <pattern id="crosses" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <path
              d="M55 45h10v10h10v10h-10v10h-10v-10h-10v-10h10z"
              fill="currentColor"
              className={showDark ? "text-primary-light" : "text-primary"}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#crosses)" />
      </svg>

      {/* Noise overlay */}
      <div className="noise-overlay absolute inset-0" />
    </div>
  )
}
