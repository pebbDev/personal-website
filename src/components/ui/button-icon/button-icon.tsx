import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonIconProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
};

export default function ButtonIcon({ label, children, ...props }: ButtonIconProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex items-center justify-center rounded-lg border border-outline p-2"
      {...props}
    >
      {children}
    </button>
  );
}
