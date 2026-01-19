import clsx from "clsx";

type TextProps = {
  children: React.ReactNode;
  muted?: boolean;
  className?: string;
};

export default function Text({ children, muted, className }: TextProps) {
  return (
    <p
      className={clsx(
        "text-base",
        muted && "text-gray-600",
        className
      )}
    >
      {children}
    </p>
  );
}
