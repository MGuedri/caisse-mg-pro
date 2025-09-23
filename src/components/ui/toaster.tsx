"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const icon = {
          destructive: <AlertTriangle className="h-6 w-6" />,
          success: <CheckCircle className="h-6 w-6" />,
          default: <Info className="h-6 w-6" />,
        }[variant || 'default'];

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 pt-0.5">{icon}</div>
              <div className="grid gap-1 flex-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
