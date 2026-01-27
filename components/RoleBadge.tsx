import { UserRole, getRoleLabel } from '@/app/lib/permissions';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
}

const roleColors = {
  admin: 'bg-red-100 text-red-800 border-red-200',
  manager: 'bg-blue-100 text-blue-800 border-blue-200',
  user: 'bg-green-100 text-green-800 border-green-200',
  viewer: 'bg-gray-100 text-gray-800 border-gray-200',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base'
};

export default function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border ${roleColors[role]} ${sizeClasses[size]} font-medium`}>
      {getRoleLabel(role)}
    </span>
  );
}