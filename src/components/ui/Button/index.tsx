import type { ButtonProps } from "./types";
import { getButtonClasses } from "./variants";

export type { ButtonProps, ButtonVariant, ButtonSize } from "./types";
export function Button(props: ButtonProps) {
  const { children, variant = "base", size = "md", className, ...elementProps } = props;
  const classes = getButtonClasses(variant, size, className);
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
