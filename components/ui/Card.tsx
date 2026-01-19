import clsx from "clsx";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return (
    <div className={clsx("card", className)}>
      {children}
    </div>
  );
}
