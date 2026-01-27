export type UserRole = 'admin' | 'manager' | 'user' | 'viewer';
export type Permission = 
  | 'view:dashboard'
  | 'view:users'
  | 'create:users'
  | 'edit:users'
  | 'delete:users'
  | 'manage:settings'
  | 'view:reports'
  | 'export:data'
  | 'view:projects'
  | 'create:projects'
  | 'edit:projects'
  | 'delete:projects'
  | 'create:tasks'; // ✅ Add this

export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    'view:dashboard',
    'view:users',
    'create:users',
    'edit:users',
    'delete:users',
    'manage:settings',
    'view:reports',
    'export:data',
    'view:projects',
    'create:projects',
    'edit:projects',
    'delete:projects',
    'create:tasks' // ✅ Add to admin
  ],
  manager: [
    'view:dashboard',
    'view:users',
    'create:users',
    'edit:users',
    'view:reports',
    'view:projects',
    'create:projects',
    'edit:projects',
    'create:tasks' // ✅ Add to manager
  ],
  user: [
    'view:dashboard',
    'view:users',
    'view:projects',
    'create:tasks' // ✅ Add to user
  ],
  viewer: [
    'view:dashboard',
    'view:users',
    'view:projects'
    // ❌ Viewers cannot create tasks
  ]
};
// Helper function to check permissions
export const hasPermission = (user: any, permission: Permission): boolean => {
  if (!user || !user.role) return false;
  if (user.role === 'admin') return true; // Admins have all permissions
  
  const permissions = rolePermissions[user.role as UserRole];
  return permissions ? permissions.includes(permission) : false;
};

// Get role label
export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    admin: 'Administrator',
    manager: 'Manager',
    user: 'Regular User',
    viewer: 'Viewer'
  };
  return labels[role];
};

// Get role color for UI
export const getRoleColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    admin: 'red',
    manager: 'blue',
    user: 'green',
    viewer: 'gray'
  };
  return colors[role] || 'gray';
};

// Get all permissions for a specific role (for debugging)
export const getPermissionsForRole = (role: UserRole): Permission[] => {
  return rolePermissions[role] || [];
};