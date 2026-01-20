"use client";

import { ElementType, ReactNode, MouseEventHandler } from "react";
import clsx from "clsx";

type HeadingProps = {
  level?: 1 | 2 | 3 | 4;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLHeadingElement>;
};

export default function Heading({
  level = 1,
  children,
  className,
  onClick,
}: HeadingProps) {
  const Tag: ElementType = `h${level}`;
  
  const sizeClasses = {
    1: "text-3xl md:text-4xl font-bold",
    2: "text-2xl font-bold",
    3: "text-xl font-bold",
    4: "text-lg font-semibold",
  };

  return (
    <Tag 
      className={clsx("text-gray-900", sizeClasses[level], className)}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}