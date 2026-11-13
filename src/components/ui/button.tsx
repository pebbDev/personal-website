import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "base" | "primary" | "dark" | "line";
export type ButtonSize = "sm" | "md" | "lg";

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type LinkProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href" | "disabled"> & {
    href: string;
    disabled?: never;
  };

type ActionProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    href?: never;
  };

export type ButtonProps = LinkProps | ActionProps;

export function Button(props: ButtonProps) {
  const { children, variant = "base", size = "md", className, ...elementProps } = props;
  const classes = ["btn", variant === "base" ? "" : `btn--${variant}`, `btn--${size}`, className]
    .filter(Boolean)
    .join(" ");

  if (typeof elementProps.href === "string") {
    const { href, ...anchorProps } = elementProps;
    return (
      <a {...anchorProps} href={href} className={classes}>
        {children}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = elementProps;
  return (
    <button {...buttonProps} type={type} className={classes}>
      {children}
    </button>
  );
}
