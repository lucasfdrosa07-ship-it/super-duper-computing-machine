"use client";
import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/app-store";

const ToastProvider = ToastPrimitive.Provider;
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

const icons = {
  success: <CheckCircle size={15} className="text-[var(--success)] shrink-0 mt-0.5" />,
  error: <AlertCircle size={15} className="text-[var(--danger)] shrink-0 mt-0.5" />,
  warning: <AlertTriangle size={15} className="text-[var(--warning)] shrink-0 mt-0.5" />,
  info: <Info size={15} className="text-[var(--accent)] shrink-0 mt-0.5" />,
};

export function Toaster() {
  const { toasts, removeToast } = useAppStore();

  return (
    <ToastProvider swipeDirection="right" duration={4000}>
      {toasts.map((toast) => (
        <ToastPrimitive.Root
          key={toast.id}
          open={true}
          onOpenChange={(open) => { if (!open) removeToast(toast.id); }}
          className={cn(
            "flex items-start gap-3 p-4 rounded-[var(--radius-lg)] border border-[var(--border)]",
            "bg-[var(--surface)] shadow-lg shadow-black/20",
            "animate-slide-in",
            "data-[state=closed]:animate-slide-out"
          )}
        >
          {icons[toast.type]}
          <div className="flex-1 min-w-0">
            <ToastPrimitive.Title className="text-sm font-medium text-[var(--fg)]">
              {toast.title}
            </ToastPrimitive.Title>
            {toast.description && (
              <ToastPrimitive.Description className="text-xs text-[var(--fg-3)] mt-0.5">
                {toast.description}
              </ToastPrimitive.Description>
            )}
          </div>
          <ToastPrimitive.Close
            onClick={() => removeToast(toast.id)}
            className="text-[var(--fg-3)] hover:text-[var(--fg)] transition-colors shrink-0"
          >
            <X size={14} />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
