import clsx from "clsx";

import Button from "./Button";
import Container from "./Container";

export type SimpleSectionProps = {
  title: string | React.ReactNode;
  element?: React.ReactNode;
  wide?: boolean;
  grid?: boolean;
  children?: React.ReactNode;
  subTitle?: string | React.ReactNode;
  className?: string;
  button?: {
    text: string;
    href: string;
    className?: string;
    ariaLabel?: string;
  };
};

export default function SimpleSection({
  title,
  element,
  wide = false,
  grid = false,
  children,
  subTitle,
  button,
  className,
}: SimpleSectionProps) {
  return (
    <section className={clsx("flex flex-col gap-12", className)}>
      <Container className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center gap-4">
          <h2 className="text-center text-4xl font-bold">{title}</h2>
          {element}
        </div>
        {subTitle && <div className="text-base-content/80 text-center">{subTitle}</div>}
      </Container>
      {children && (
        <Container wide={wide} grid={grid}>
          {children}
        </Container>
      )}
      {button && (
        <Container className="flex justify-center">
          <Button
            href={button.href}
            text={button.text}
            className={button.className || "btn-lg"}
            ariaLabel={button.ariaLabel}
          />
        </Container>
      )}
    </section>
  );
}
