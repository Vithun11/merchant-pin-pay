import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:shadow-neon transform hover:scale-[1.02] active:scale-[0.98] border border-primary/20 hover:border-primary/40 transition-glow",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-destructive/30 hover:shadow-[0_0_20px_hsl(var(--destructive)/0.4)]",
        outline: "border border-border bg-gradient-cyber hover:bg-gradient-primary hover:text-primary-foreground hover:border-primary/50 hover:shadow-neon transition-glow",
        secondary: "bg-gradient-secondary text-secondary-foreground hover:shadow-purple transform hover:scale-[1.02] active:scale-[0.98] border border-neon-purple/20 hover:border-neon-purple/40 transition-glow",
        ghost: "hover:bg-gradient-cyber hover:text-accent-foreground transition-glow",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-glow transition-glow",
        success: "bg-gradient-success text-success-foreground hover:shadow-[0_0_20px_hsl(var(--success)/0.4)] transform hover:scale-[1.02] active:scale-[0.98] border border-success/30 transition-glow",
        fintech: "bg-gradient-primary text-primary-foreground border border-primary/30 hover:shadow-neon transform hover:scale-[1.02] active:scale-[0.98] hover:border-primary/50 transition-glow",
        card: "bg-gradient-card text-card-foreground border border-border/50 hover:shadow-soft hover:border-accent/50 transform hover:scale-[1.01] active:scale-[0.99] transition-glow"
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-md px-4",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
        xl: "h-14 rounded-xl px-10 text-lg"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
