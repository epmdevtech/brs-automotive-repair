import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "btn disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed aria-busy:cursor-progress aria-busy:opacity-70 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "btn--primary",
        primary: "btn--primary",
        secondary: "btn--secondary",
        link: "btn--link",
        tertiary: "btn--link",
        compact: "btn--primary btn--sm",
        automotive: "btn--primary",
        automotiveOutline: "btn--secondary",
        editorial: "btn--link",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "btn--secondary",
        ghost: "bg-transparent text-foreground hover:bg-white/10 hover:text-white",
      },
      size: {
        default: "",
        sm: "btn--sm",
        lg: "h-11 px-6",
        xl: "h-12 px-7 text-xs",
        icon: "size-11 min-w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
