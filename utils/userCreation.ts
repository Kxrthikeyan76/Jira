// utils/userCreation.ts
import { User } from './userStorage';
import { saveUser } from './userStorage';

// Generate a unique ID for new users
const generateId = () => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// Default permissions based on role
const getDefaultPermissions = (role: string) => {
  const basePermissions = {
    canCreateProject: false,
    canEditProject: false,
    canDeleteProject: false,
    canAddMember: false,
    canEditMember: false,
    canDeleteMember: false,
  };

  // You can set default permissions based on role here
  // For now, return base permissions (admin will customize)
  return basePermissions;
};

// Create a new user
export const createNewUser = (
  name: string,
  email: string,
  password: string,
  role: string,
  permissions: any,
  createdBy: string
): User => {
  const newUser: User = {
    id: generateId(),
    name,
    email,
    password,
    role,
    status: 'active',
    createdBy,
    createdAt: new Date().toISOString(),
    permissions: permissions || getDefaultPermissions(role),
  };

  return newUser;
};

// Save a new user to storage
export const createAndSaveUser = (
  name: string,
  email: string,
  password: string,
  role: string,
  permissions: any,
  createdBy: string
): boolean => {
  try {
    const newUser = createNewUser(name, email, password, role, permissions, createdBy);
    return saveUser(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return false;
  }
};  