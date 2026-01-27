// components/users/CreateUserForm.tsx
"use client";

import { useState } from 'react';
import { FiUserPlus, FiMail, FiLock, FiUser, FiSave, FiX } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { createAndSaveUser } from '@/utils/userCreation';

export default function CreateUserForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user: currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'default123', // Default password
    role: 'member',
    permissions: {
      canCreateProject: false,
      canEditProject: false,
      canDeleteProject: false,
      canAddMember: false,
      canEditMember: false,
      canDeleteMember: false,
    }
  });

  // Available roles
  const roles = [
    { value: 'admin', label: 'Administrator' },
    { value: 'project_lead', label: 'Project Lead' },
    { value: 'product_manager', label: 'Product Manager' },
    { value: 'senior_dev', label: 'Senior Developer' },
    { value: 'design_lead', label: 'Design Lead' },
    { value: 'marketing_specialist', label: 'Marketing Specialist' },
    { value: 'qa_engineer', label: 'QA Engineer' },
    { value: 'devops_engineer', label: 'DevOps Engineer' },
    { value: 'member', label: 'Team Member' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission as keyof typeof prev.permissions]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const success = createAndSaveUser(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.permissions,
        currentUser?.name || 'Admin'
      );

      if (success) {
        setSuccess(`User "${formData.name}" created successfully!`);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: 'default123',
          role: 'member',
          permissions: {
            canCreateProject: false,
            canEditProject: false,
            canDeleteProject: false,
            canAddMember: false,
            canEditMember: false,
            canDeleteMember: false,
          }
        });

        // Close form after success
        setTimeout(() => {
          setIsOpen(false);
          setSuccess('');
          if (onSuccess) onSuccess();
        }, 2000);
      } else {
        setError('Failed to create user. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      password: 'default123',
      role: 'member',
      permissions: {
        canCreateProject: false,
        canEditProject: false,
        canDeleteProject: false,
        canAddMember: false,
        canEditMember: false,
        canDeleteMember: false,
      }
    });
    setError('');
    setSuccess('');
    setIsOpen(false);
  };

  // If not admin, don't show anything
  if (currentUser?.role !== 'admin') {
    return null;
  }

  return (
    <div className="mb-8">
      {/* Create User Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FiUserPlus className="w-5 h-5" />
          <span>Create New User</span>
        </button>
      )}

      {/* Create User Form */}
      {isOpen && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mt-4 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Create New User</h3>
            <button
              onClick={handleReset}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-1">
                    <FiUser className="w-4 h-4" />
                    Full Name *
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-1">
                    <FiMail className="w-4 h-4" />
                    Email Address *
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-1">
                    <FiLock className="w-4 h-4" />
                    Password *
                  </span>
                </label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter password"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Default password: default123. User should change it after first login.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Permissions Section */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Project Permissions */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-3">Project Permissions</h5>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.canCreateProject}
                        onChange={() => handlePermissionChange('canCreateProject')}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">Create Projects</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.canEditProject}
                        onChange={() => handlePermissionChange('canEditProject')}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">Edit Projects</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.canDeleteProject}
                        onChange={() => handlePermissionChange('canDeleteProject')}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">Delete Projects</span>
                    </label>
                  </div>
                </div>

                {/* Team Member Permissions */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-3">Team Member Permissions</h5>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.canAddMember}
                        onChange={() => handlePermissionChange('canAddMember')}
                        className="h-4 w-4 text-green-600 rounded"
                      />
                      <span className="text-sm text-gray-700">Add Team Members</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.canEditMember}
                        onChange={() => handlePermissionChange('canEditMember')}
                        className="h-4 w-4 text-green-600 rounded"
                      />
                      <span className="text-sm text-gray-700">Edit Team Members</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.canDeleteMember}
                        onChange={() => handlePermissionChange('canDeleteMember')}
                        className="h-4 w-4 text-green-600 rounded"
                      />
                      <span className="text-sm text-gray-700">Delete Team Members</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <FiSave className="w-4 h-4" />
                {isSubmitting ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}