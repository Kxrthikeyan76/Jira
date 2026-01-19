import { ElementType } from "react";
import clsx from "clsx";

type HeadingProps = {
  level?: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
};

export default function Heading({
  level = 1,
  children,
  className,
}: HeadingProps) {
  const Tag: ElementType = `h${level}`;

  return (
    <Tag className={clsx(`heading-${level}`, className)}>
      {children}
    </Tag>
  );
}
