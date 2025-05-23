import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-white shadow-sm hover:bg-gray-100 hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-primary-100 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        slim: "bg-transparent text-primary-foreground border border-stone-300 text-text-foreground hover:bg-stone-100",
        action: "bg-action text-action-foreground shadow-sm hover:bg-action/90",
        landingpageCTA:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 ",
        login: "bg-black text-white hover:bg-[#2e2e2e] ",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-4 rounded-md px-1 text-xs",
        lg: "h-10 rounded-md px-4 md:px-8 text-md md:text-xl py-4 md:py-8",
        icon: "h-9 w-9",
        login: "h-10 rounded-md px-3 text-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading, className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
