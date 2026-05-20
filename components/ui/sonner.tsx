"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"
import { Toaster as Sonner, toast, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  useEffect(() => {
    /** Dismiss visible toasts when the user taps the toast body (not actions / links). */
    const onClickCapture = (e: MouseEvent) => {
      const el = e.target
      if (!(el instanceof Element)) return
      const toastRoot = el.closest("li[data-sonner-toast]")
      if (!toastRoot) return
      if (el.closest("[data-button]")) return
      if (el.closest("[data-close-button]")) return
      if (el.closest("a[href]")) return
      toast.dismiss()
    }
    document.addEventListener("click", onClickCapture, true)
    return () => document.removeEventListener("click", onClickCapture, true)
  }, [])

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast cursor-pointer",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
