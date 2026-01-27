// utils/userStorage.ts

// Define User type
export type User = {
  id: number;
  name: string;
  email: string;
  password?: string; // Optional because we remove it when storing
  role: string;
  status: 'active' | 'inactive';
  createdBy?: string;
  createdAt?: string;
  permissions?: {
    canCreateProject: boolean;
    canEditProject: boolean;
    canDeleteProject: boolean;
    canAddMember: boolean;
    canEditMember: boolean;
    canDeleteMember: boolean;
  };
};

// Get user by email and password
export const getUserFromStorage = (email: string, password: string): User | null => {
  try {
    const usersStr = localStorage.getItem('users');
    if (!usersStr) return null;
    
    const users: User[] = JSON.parse(usersStr);
    return users.find((user: User) => 
      user.email === email && 
      user.password === password &&
      user.status === 'active'
    ) || null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

// Get all users
export const getAllUsers = (): User[] => {
  try {
    const usersStr = localStorage.getItem('users');
    return usersStr ? JSON.parse(usersStr) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Save user
export const saveUser = (user: User): boolean => {
  try {
    const users = getAllUsers();
    
    // Check if user already exists
    const existingIndex = users.findIndex((u: User) => u.id === user.id || u.email === user.email);
    
    if (existingIndex >= 0) {
      // Update existing user
      users[existingIndex] = user;
    } else {
      // Add new user
      users.push(user);
    }
    
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};