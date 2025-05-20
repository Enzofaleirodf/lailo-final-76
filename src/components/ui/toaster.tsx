
import { useToast } from "@/hooks/use-toast"
import {
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  // Using empty toasts array
  return (
    <ToastProvider>
      {/* Empty toasts array, no toasts will be rendered */}
      <ToastViewport />
    </ToastProvider>
  )
}
