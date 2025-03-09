"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.duration) {
        const timer = setTimeout(() => {
          dismiss(toast.id);
        }, toast.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [toasts, dismiss]);

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-2">
              {title && (
                <ToastTitle className="flex items-center gap-2">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-[0.925rem]">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
