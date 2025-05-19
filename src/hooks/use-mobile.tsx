
import * as React from "react"

const MOBILE_BREAKPOINT = 1024 // lg breakpoint para melhor suporte a tablet

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== "undefined" 
      ? window.innerWidth < MOBILE_BREAKPOINT 
      : true // Default para SSR
  )

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set initial value
    checkMobile()
    
    // Add resize listener
    window.addEventListener("resize", checkMobile)
    
    // Clean up
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}
