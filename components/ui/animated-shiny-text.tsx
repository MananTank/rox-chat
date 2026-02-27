import { cn } from "@/lib/utils";

const variantStyles = {
  muted: {
    "--shine-muted-foreground":
      "color-mix(in srgb, var(--muted-foreground) 80%, transparent)",
    "--shine-foreground": "var(--foreground)",
  },
  primary: {
    "--shine-muted-foreground":
      "color-mix(in srgb, var(--primary-foreground) 50%, transparent)",
    "--shine-foreground": "var(--primary-foreground)",
  },
};

export function AnimatedShinyText(props: {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variantStyles;
}) {
  const variantStyle = variantStyles[props.variant ?? "muted"];

  return (
    <p
      className={cn(
        "animate-text-shimmer bg-size-[200%_50%] bg-clip-text text-transparent will-change-auto",
        props.className,
      )}
      style={
        {
          animation: "text-shimmer 1.25s linear infinite",
          ...variantStyle,
          backgroundImage:
            "linear-gradient(70deg, var(--shine-muted-foreground) 30%, var(--shine-foreground) 70%, var(--shine-muted-foreground) 100%)",
        } as React.CSSProperties
      }
    >
      {props.children}
    </p>
  );
}
