import * as React from "react"
import * as DirectionPrimitive from "@radix-ui/react-direction"

interface DirectionProviderProps {
  dir?: "ltr" | "rtl"
  direction?: "ltr" | "rtl"
  children?: React.ReactNode
}

function DirectionProvider({
  dir,
  direction,
  children,
}: DirectionProviderProps) {
  // ✅ FIX: Use a fallback and 'as any' to satisfy the strict Radix internal type
  return (
    <DirectionPrimitive.Provider dir={(direction ?? dir ?? "ltr") as any}>
      {children}
    </DirectionPrimitive.Provider>
  )
}

const useDirection = DirectionPrimitive.useDirection

export { DirectionProvider, useDirection }