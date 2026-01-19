type BadgeProps = {
  color?: "blue" | "green" | "red";
  children: React.ReactNode;
};

export default function Badge({ color = "blue", children }: BadgeProps) {
  const map = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${map[color]}`}>
      {children}
    </span>
  );
}
