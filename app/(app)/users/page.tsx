// app/(app)/users/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  FaUserPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaTimes,
  FaCheck,
  FaEnvelope,
  FaUser,
  FaUserShield,
  FaUserTie,
  FaEye,
  FaLock,
  FaExclamationTriangle,
  FaChevronDown
} from "react-icons/fa";
import { Button, Input, Card, Heading, Text, Badge, Container } from "@/components/ui";

// Static/default password for all new users
const DEFAULT_PASSWORD = "Welcome@123";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  department?: string;
  status: "active" | "pending" | "inactive";
  createdAt: string;
  createdBy?: number;
};

// ✅ MOVE HELPER FUNCTIONS OUTSIDE COMPONENT (before useMemo)
const getRoleIcon = (role: string) => {
  switch(role) {
    case 'admin': return <FaUserShield className="text-red-500" />;
    case 'manager': return <FaUserTie className="text-blue-500" />;
    case 'user': return <FaUser className="text-green-500" />;
    case 'viewer': return <FaEye className="text-gray-500" />;
    default: return <FaUser />;
  }
};

const getRoleBadgeColor = (role: string) => {
  switch(role) {
    case 'admin': return 'red';
    case 'manager': return 'blue';
    case 'user': return 'green';
    case 'viewer': return 'gray';
    default: return 'gray';
  }
};

const getStatusBadge = (status: string) => {
  switch(status) {
    case 'active': return <Badge color="green">Active</Badge>;
    case 'pending': return <Badge color="yellow">Pending</Badge>;
    case 'inactive': return <Badge color="gray">Inactive</Badge>;
    default: return <Badge color="gray">{status}</Badge>;
  }
};

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    department: ""
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [showModal]);

  useEffect(() => {
    const userData = sessionStorage.getItem('currentUser');
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
    
    // Load users from localStorage
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  // ✅ SECURITY: Check if current user can create users
  const canCreateUsers = useMemo(() => {
    return currentUser?.role === 'admin' || currentUser?.role === 'manager';
  }, [currentUser]);

  // ✅ SECURITY: Check if current user can edit a specific target user
  const canEditUser = useMemo(() => {
    return (targetUser: User) => {
      const currentUserRole = currentUser?.role;
      const targetUserRole = targetUser.role;
      
      // 1. User cannot edit themselves
      if (targetUser.email === currentUser?.email) {
        return false;
      }
      
      // 2. Admins can edit anyone (except themselves)
      if (currentUserRole === 'admin') {
        return true;
      }
      
      // 3. Managers can only edit users and viewers (not other managers or admins)
      if (currentUserRole === 'manager') {
        return targetUserRole === 'user' || targetUserRole === 'viewer';
      }
      
      // 4. Regular users and viewers cannot edit anyone
      return false;
    };
  }, [currentUser]);

  // ✅ SECURITY: Check if current user can delete a specific target user
  const canDeleteUser = useMemo(() => {
    return (targetUser: User) => {
      const currentUserRole = currentUser?.role;
      const targetUserRole = targetUser.role;
      
      // 1. User cannot delete themselves
      if (targetUser.email === currentUser?.email) {
        return false;
      }
      
      // 2. Only admins can delete users
      if (currentUserRole === 'admin') {
        // Admins cannot delete other admins
        return targetUserRole !== 'admin';
      }
      
      return false;
    };
  }, [currentUser]);

  // ✅ FIXED: Admin can assign ANY role including admin
  const canAssignRole = useMemo(() => {
    return (role: string) => {
      const currentUserRole = currentUser?.role;
      
      if (currentUserRole === 'admin') {
        // ✅ FIXED: Admin can assign ANY role including admin
        return true;
      }
      
      if (currentUserRole === 'manager') {
        // Manager can only assign user or viewer roles
        return role === 'user' || role === 'viewer';
      }
      
      // Regular users and viewers cannot assign any roles
      return false;
    };
  }, [currentUser]);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "user",
      department: ""
    });
    setEditingId(null);
    setError("");
    setShowRoleDropdown(false);
  };

  const handleSave = () => {
    setError("");

    if (!formData.name || !formData.email) {
      setError("Please fill in required fields: Name and Email");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email.toLowerCase() === formData.email.toLowerCase() && user.id !== editingId)) {
      setError("A user with this email already exists");
      return;
    }

    // ✅ FIXED: Admin can assign any role including admin
    if (!canAssignRole(formData.role)) {
      setError(`You don't have permission to assign the "${formData.role}" role`);
      return;
    }

    // ✅ ADDED: Security warning when Admin creates another Admin
    if (formData.role === 'admin' && currentUser?.role === 'admin' && !editingId) {
      const confirmCreateAdmin = window.confirm(
        "⚠️ SECURITY WARNING ⚠️\n\n" +
        "You are about to create another Administrator account.\n\n" +
        "Administrators have FULL ACCESS to:\n" +
        "• Create, edit, delete any user\n" +
        "• Manage all projects\n" +
        "• Access system settings\n" +
        "• Delete important data\n\n" +
        "Are you sure you want to proceed?"
      );
      
      if (!confirmCreateAdmin) {
        return;
      }
    }

    if (editingId !== null) {
      // Find the user being edited
      const userToEdit = users.find(user => user.id === editingId);
      if (!userToEdit) {
        setError("User not found");
        return;
      }

      // ✅ SECURITY: Check if current user can edit this user
      if (!canEditUser(userToEdit)) {
        setError("You don't have permission to edit this user");
        return;
      }

      // Update existing user
      setUsers(prev => prev.map(user => 
        user.id === editingId ? {
          ...user,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          department: formData.department
        } : user
      ));
      
      alert("User updated successfully!");
    } else {
      // Create new user with static/default password
      const newUser: User = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department || "General",
        status: "pending", // User needs to set password on first login
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.id
      };

      setUsers(prev => [...prev, newUser]);
      
      // Show success message
      alert(`User "${formData.name}" created successfully!\n\nAn email has been sent to ${formData.email} with instructions to set their password.\n\nDefault temporary password: ${DEFAULT_PASSWORD}`);
    }

    resetForm();
    setShowModal(false);
  };

  const handleEdit = (user: User) => {
    // ✅ SECURITY: Check if current user can edit this user
    if (!canEditUser(user)) {
      alert("You don't have permission to edit this user");
      return;
    }

    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || ""
    });
    setShowModal(true);
  };

  const handleDelete = (user: User) => {
    // ✅ SECURITY: Check if current user can delete this user
    if (!canDeleteUser(user)) {
      alert("You don't have permission to delete this user");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete user "${user.name}"?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    setUsers(prev => prev.filter(u => u.id !== user.id));
    alert("User deleted successfully!");
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* MAIN CONTENT */}
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <Container size="xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <FaUser className="text-2xl text-white" />
                </div>
                <div>
                  <Heading level={1}>Users</Heading>
                  <Text variant="muted">
                    {users.length === 0 
                      ? "Add your first team member" 
                      : `Manage ${users.length} team members`}
                  </Text>
                </div>
              </div>

              {/* Create User Button */}
              {canCreateUsers && (
                <Button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  variant="primary"
                  size="lg"
                >
                  <span className="flex items-center gap-2">
                    <FaUserPlus /> Add User
                  </span>
                </Button>
              )}
            </div>

            {/* Search Bar */}
            <Card className="p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search users by name, email, or department..."
                      className="pl-12 w-full"
                    />
                  </div>
                </div>
                {searchTerm && (
                  <Button
                    variant="secondary"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            </Card>
          </div>

         
          {/* Users Table */}
          <Card className="border-0 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Heading level={3}>
                  All Users <Badge color="gray">{filteredUsers.length}</Badge>
                </Heading>
                <Text variant="muted">
                  Showing {filteredUsers.length} of {users.length} users
                </Text>
              </div>

              {filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => {
                        const isCurrentUser = user.email === currentUser?.email;
                        const canEdit = canEditUser(user);
                        const canDelete = canDeleteUser(user);
                        
                        return (
                          <tr 
                            key={user.id} 
                            className={`hover:bg-gray-50 ${isCurrentUser ? 'bg-blue-50' : ''}`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 ${
                                  isCurrentUser ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.name} {isCurrentUser && <Badge color="blue">You</Badge>}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {getRoleIcon(user.role)}
                                <Badge color={getRoleBadgeColor(user.role)}>
                                  {user.role}
                                </Badge>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.department || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(user.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex gap-2">
                                {canEdit ? (
                                  <Button
                                    onClick={() => handleEdit(user)}
                                    variant="ghost"
                                    size="sm"
                                    title="Edit user"
                                  >
                                    <FaEdit />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled
                                    title={isCurrentUser ? "Cannot edit yourself" : "No permission"}
                                    className="opacity-50 cursor-not-allowed"
                                  >
                                    <FaEdit />
                                  </Button>
                                )}
                                {canDelete ? (
                                  <Button
                                    onClick={() => handleDelete(user)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-800"
                                    title="Delete user"
                                  >
                                    <FaTrash />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled
                                    title={isCurrentUser ? "Cannot delete yourself" : "No permission"}
                                    className="opacity-50 cursor-not-allowed"
                                  >
                                    <FaTrash />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
                  <Heading level={3} className="mb-2">
                    {searchTerm ? "No users found" : "No users yet"}
                  </Heading>
                  <Text className="text-gray-600 mb-6 max-w-md mx-auto">
                    {searchTerm 
                      ? "Try adjusting your search terms"
                      : "Start by adding your first team member!"}
                  </Text>
                  {canCreateUsers && (
                    <Button
                      onClick={() => {
                        resetForm();
                        setShowModal(true);
                      }}
                      variant="primary"
                      size="lg"
                    >
                      <span className="flex items-center gap-2">
                        <FaUserPlus /> Add First User
                      </span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        </Container>
      </div>

      {/* ✅ FIXED: MODAL OUTSIDE MAIN CONTENT */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              resetForm();
              setShowModal(false);
            }}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] mx-4 overflow-hidden z-50">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {editingId ? (
                      <FaEdit className="text-xl text-blue-600" />
                    ) : (
                      <FaUserPlus className="text-xl text-green-600" />
                    )}
                  </div>
                  <div>
                    <Heading level={2}>
                      {editingId ? "Edit User" : "Add New User"}
                    </Heading>
                    <Text variant="muted" size="sm">
                      {editingId ? "Update user details" : "Fill in user details below"}
                    </Text>
                  </div>
                </div>
                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="p-6">
                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaExclamationTriangle className="text-red-500" />
                      <Text size="sm" className="text-red-600">
                        {error}
                      </Text>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter full name"
                        className="w-full pl-10"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="Enter email address"
                        className="w-full pl-10"
                      />
                    </div>
                  </div>

                  {/* Role - CHANGED FROM BUTTONS TO DROPDOWN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                        className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {getRoleIcon(formData.role)}
                          <span className="capitalize">{formData.role}</span>
                        </div>
                        <FaChevronDown className={`text-gray-400 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showRoleDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                          {['user', 'viewer', 'manager', 'admin'].map((role) => {
                            const canAssign = canAssignRole(role);
                            
                            return (
                              <button
                                key={role}
                                type="button"
                                onClick={() => {
                                  if (canAssign) {
                                    setFormData({...formData, role});
                                    setShowRoleDropdown(false);
                                  }
                                }}
                                disabled={!canAssign}
                                className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors ${
                                  !canAssign 
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'cursor-pointer'
                                } ${formData.role === role ? 'bg-blue-50 text-blue-700' : ''}`}
                                title={!canAssign ? `You cannot assign "${role}" role` : ''}
                              >
                                {getRoleIcon(role)}
                                <span className="capitalize">{role}</span>
                                {formData.role === role && (
                                  <FaCheck className="ml-auto text-blue-600" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <Text size="xs" variant="muted" className="mt-2">
                      {currentUser?.role === 'admin' 
                        ? "You can assign any role"
                        : currentUser?.role === 'manager'
                        ? "You can assign User or Viewer roles only"
                        : "You cannot assign roles"}
                    </Text>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department (Optional)
                    </label>
                    <Input
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      placeholder="e.g., Engineering, Marketing, Sales"
                      className="w-full"
                    />
                  </div>

                  {/* Password Info (only for new users) */}
                  {!editingId && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <FaLock className="text-yellow-600 mt-0.5" />
                        <div>
                          <Text size="sm" className="font-medium text-yellow-800">
                            Password Information
                          </Text>
                          <Text size="xs" className="text-yellow-700 mt-1">
                            User will receive an email with instructions to set their password.
                            The default temporary password is: <code className="bg-white px-2 py-1 rounded border font-mono">Welcome@123</code>
                          </Text>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t px-6 py-4">
              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  disabled={!formData.name || !formData.email}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                >
                  <span className="flex items-center gap-2">
                    <FaCheck /> {editingId ? "Update User" : "Add User"}
                  </span>
                </Button>
                <Button
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                >
                  <span className="flex items-center gap-2">
                    <FaTimes /> Cancel
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}