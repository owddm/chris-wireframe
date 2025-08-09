import { forwardRef } from "react";

import { resolveInternalHref } from "@/utils/urlResolver";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  ref?: React.RefObject<HTMLAnchorElement>;
}

const LinkReact = forwardRef<HTMLAnchorElement, LinkProps>(function LinkReact(
  { href, children, ...rest },
  ref,
) {
  const finalHref = resolveInternalHref(href);

  return (
    <a ref={ref} href={finalHref} {...rest}>
      {children}
    </a>
  );
});

export default LinkReact;
