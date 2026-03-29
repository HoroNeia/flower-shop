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
  const finalDir: "ltr" | "rtl" = direction ?? dir ?? "ltr";

  return (
    <DirectionPrimitive.Provider dir={finalDir}>
      {children}
    </DirectionPrimitive.Provider>
  )
}

export { DirectionProvider }