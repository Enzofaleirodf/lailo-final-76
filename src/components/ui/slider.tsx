
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  // Always enforce exactly two thumbs for range sliders
  const defaultValue = props.defaultValue || [0, 100];
  const value = props.value || defaultValue;
  
  // Always ensure we have a valid array with 2 elements
  const ensureValidRange = (val: number | number[]): [number, number] => {
    if (Array.isArray(val)) {
      // If array has less than 2 elements, add the missing ones
      if (val.length === 0) return [0, 100];
      if (val.length === 1) return [val[0], val[0] + 100];
      // If has 2 or more, use the first two
      return [val[0], val[1]];
    }
    // If not an array, create an array with 2 elements
    return [val, val + 100];
  };

  const safeDefaultValue = ensureValidRange(defaultValue);
  
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      // Always pass exactly 2 values for range sliders
      defaultValue={safeDefaultValue}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {/* Always render exactly 2 thumbs */}
      <SliderPrimitive.Thumb 
        className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      />
      <SliderPrimitive.Thumb
        className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
