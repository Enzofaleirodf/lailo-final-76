
import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 data-[state=on]:bg-brand-600 data-[state=on]:text-white data-[state=on]:border-brand-700 data-[state=on]:shadow-md",
        outline:
          "border border-input bg-transparent hover:bg-gray-50 hover:text-gray-800 data-[state=on]:bg-brand-600 data-[state=on]:text-white data-[state=on]:border-brand-700",
        accent2:
          "bg-transparent hover:bg-accent2-50 data-[state=on]:bg-accent2-500 data-[state=on]:text-black data-[state=on]:border-accent2-600",
        brand:
          "bg-white border border-gray-200 text-gray-700 hover:bg-brand-50 hover:text-brand-700 data-[state=on]:bg-brand-600 data-[state=on]:text-white data-[state=on]:border-brand-700 data-[state=on]:shadow-sm",
        multi:
          "bg-white border border-gray-200 text-gray-700 hover:bg-brand-50 hover:text-brand-700 data-[state=on]:bg-brand-100 data-[state=on]:text-brand-800 data-[state=on]:border-brand-300 data-[state=on]:shadow-sm",
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-9 px-2.5 py-1.5",
        lg: "h-11 px-5",
        xs: "h-8 px-2 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
