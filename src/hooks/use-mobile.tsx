
import * as React from "react"

const MOBILE_BREAKPOINT = 768 // Changed from 1024 to 768 (md breakpoint) for better mobile experience

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
