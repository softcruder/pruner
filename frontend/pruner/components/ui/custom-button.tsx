import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        dark: "bg-[#1A1D26] text-white hover:bg-[#2A2D36]",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-3xl",
        lg: "h-11 px-8 rounded-3xl",
        icon: "h-12 w-12 rounded-full p-2",
      },
      shadow: {
        default: "shadow-button=primary",
        md: "shadow-md",
        lg: "shadow-lg",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shadow: "default",
    },
  }
)

// Spinner component
const Spinner = () => (
    <svg
      className="w-5 h-5 mr-3 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2"></circle>
      <path d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z" stroke="currentColor"></path>
    </svg>
  )

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shadow, loading, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button"
    return (
    <Comp
        className={cn(buttonVariants({ variant, size, shadow, className }), { 'opacity-50 cursor-not-allowed': loading })}
        ref={ref}
        disabled={loading}
        {...props}
      >
        {loading && <Spinner />}
        {!loading && props.children}
      </Comp>
    )
  }
)
CustomButton.displayName = "CustomButton"

export { CustomButton, buttonVariants }