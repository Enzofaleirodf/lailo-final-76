
import * as React from "react";
import { useMediaQuery, breakpoints } from "./useMediaQuery";

export function useIsMobile() {
  // Use the unified media query system
  return useMediaQuery("md");
}
