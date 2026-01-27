// utils/initializeStorage.ts
import { User } from './userStorage'; // ADD THIS IMPORT

export const initializeStorage = () => {
  const isFirstVisit = !localStorage.getItem('appInitialized');
  
  if (isFirstVisit) {
    console.log('First visit detected. Setting up admin user...');
    
    // Create admin user with ALL permissions
    const adminUser: User = { // ADD TYPE HERE
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      status: 'active',
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      permissions: {
        canCreateProject: true,
        canEditProject: true,
        canDeleteProject: true,
        canAddMember: true,
        canEditMember: true,
        canDeleteMember: true,
      }
    };
    
    // Create users array with only admin
    const users: User[] = [adminUser]; // ADD TYPE HERE
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', '');
    localStorage.setItem('appInitialized', 'true');
    
    console.log('Admin user created successfully!');
    
    return true;
  }
  
  return false;
};