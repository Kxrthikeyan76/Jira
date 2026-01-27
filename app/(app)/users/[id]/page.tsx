// app/(app)/users/[id]/page.tsx - WITH CONSISTENT PADDING
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { User, USERS } from '@/data/users';
import { 
  FiArrowLeft,
  FiBriefcase,
  FiUsers,
  FiCalendar,
  FiEdit,
  FiSave,
  FiX,
  FiCamera,
  FiFolder,
  FiCheckCircle,
  FiActivity,
  FiAward,
  FiTrash2 // ADD THIS IMPORT
} from "react-icons/fi";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setCurrentUser(JSON.parse(storedUser));

    const userId = parseInt(params.id as string);
    const user = USERS.find(u => u.id === userId);
    if (user) {
      setProfileUser(user);
      setEditedUser({ ...user });
      setImagePreview(user.profilePhoto || null);
    }
  }, [params.id, router]);

  const isOwnProfile = currentUser?.id === profileUser?.id;
  
  // ADD PERMISSION CHECK FUNCTIONS
  const canEditUser = () => {
    // User can edit own profile OR admin can edit anyone
    return isOwnProfile || currentUser?.role === 'admin';
  };

  const canDeleteUser = () => {
    // Only admin can delete users, and cannot delete themselves
    return currentUser?.role === 'admin' && !isOwnProfile;
  };

  const canAssignTasks = () => {
    // Admin and manager can assign tasks
    return currentUser?.role === 'admin' || currentUser?.role === 'manager';
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profileUser) {
      setEditedUser({ ...profileUser });
      setImagePreview(profileUser.profilePhoto || null);
    }
  };

  const handleSave = () => {
    if (!editedUser) return;
    
    if (isOwnProfile) {
      localStorage.setItem('currentUser', JSON.stringify(editedUser));
      setCurrentUser(editedUser);
    }
    
    setProfileUser(editedUser);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleChange = (field: keyof User, value: string | string[]) => {
    if (!editedUser) return;
    setEditedUser({ ...editedUser, [field]: value });
  };

  const handleDeleteUser = () => {
    if (profileUser && canDeleteUser()) {
      const confirmed = window.confirm(
        `Are you sure you want to delete ${profileUser.name}? This action cannot be undone.`
      );
      if (confirmed) {
        alert(`User ${profileUser.name} has been deleted.`);
        router.push('/users');
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('File size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      if (editedUser) {
        setEditedUser({ ...editedUser, profilePhoto: base64String });
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImagePreview(null);
    if (editedUser) {
      setEditedUser({ ...editedUser, profilePhoto: '' });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!profileUser || !editedUser) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User not found</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* MAIN CONTAINER - Same as project page */}
      <div className="p-6 lg:p-8">
        {/* Header with Back Button - Same spacing */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <FiArrowLeft />
            <span>Back </span>
          </button>
          
          {/* Profile Header Card - Same card style as projects */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {/* Profile Photo with Upload */}
                <div className="relative">
                  <div className="relative group">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt={editedUser.name}
                          className="w-24 h-24 rounded-lg object-cover border-2 border-white shadow"
                        />
                        {isEditing && (
                          <button
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold">
                        {editedUser.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    
                    {/* ONLY SHOW CAMERA BUTTON IF USER CAN EDIT */}
                    {isEditing && canEditUser() && (
                      <>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          onClick={triggerFileInput}
                          className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg"
                          title="Upload photo"
                        >
                          <FiCamera className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Name & Role - Editable */}
                <div>
                  {isEditing && canEditUser() ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editedUser.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="text-2xl font-bold text-gray-900 bg-gray-100 border border-gray-300 rounded px-3 py-2"
                        placeholder="Full Name"
                      />
                      <input
                        type="text"
                        value={editedUser.role}
                        onChange={(e) => handleChange('role', e.target.value)}
                        className="text-gray-700 bg-gray-100 border border-gray-300 rounded px-3 py-2"
                        placeholder="Role"
                      />
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{editedUser.name}</h1>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-gray-700">{editedUser.role}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{editedUser.department}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Edit/Save/Cancel Buttons - WITH PERMISSION CHECK */}
              {canEditUser() && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 flex items-center gap-2"
                      >
                        <FiSave className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FiX className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiEdit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Status & Stats Row */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${editedUser.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className={`text-sm font-medium ${editedUser.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                    {editedUser.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Joined {editedUser.joinDate}</span>
                </div>
              </div>
              
              {/* Delete Button - ONLY FOR ADMIN AND NOT OWN PROFILE */}
              {canDeleteUser() && (
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 flex items-center gap-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span>Delete User</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid - Same spacing as project cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Work Information */}
          <div className="space-y-6">
            {/* Department & Work Details Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiBriefcase className="w-5 h-5 text-gray-500" />
                Work Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-2">Department</div>
                  {isEditing && canEditUser() ? (
                    <input
                      type="text"
                      value={editedUser.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      className="font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded px-3 py-2 w-full"
                      placeholder="Department"
                    />
                  ) : (
                    <div className="font-medium text-gray-900">{editedUser.department}</div>
                  )}
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-2">Location</div>
                  {isEditing && canEditUser() ? (
                    <input
                      type="text"
                      value={editedUser.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded px-3 py-2 w-full"
                      placeholder="Location"
                    />
                  ) : (
                    <div className="font-medium text-gray-900">{editedUser.location}</div>
                  )}
                </div>
                
                {/* Team Information */}
               
              </div>
            </div>

            {/* Current Projects Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiFolder className="w-5 h-5 text-gray-500" />
                Current Projects 
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-100">
                  <div>
                    <div className="font-medium text-gray-900">Project Alpha</div>
                  
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                  <div>
                    <div className="font-medium text-gray-900">Project Beta</div>
                    
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">Planning</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Performance & Actions */}
          <div className="space-y-6">
            {/* Performance Metrics Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiAward className="w-5 h-5 text-gray-500" />
                Performance Metrics
              </h2>
              
              <div className="space-y-4">
                {/* Task Completion Rate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Task Completion</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {editedUser.tasks && editedUser.completedTasks 
                        ? `${Math.round((editedUser.completedTasks / editedUser.tasks) * 100)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: `${editedUser.tasks && editedUser.completedTasks 
                          ? Math.round((editedUser.completedTasks / editedUser.tasks) * 100) 
                          : 0
                        }%` 
                      }}
                    />
                  </div>
                </div>
                
                {/* On-Time Delivery */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">On-Time Delivery</span>
                    <span className="text-sm font-semibold text-gray-900">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
                
                {/* Quality Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Quality Score</span>
                    <span className="text-sm font-semibold text-gray-900">88%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Work Actions Card - WITH PERMISSION CHECKS */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Work Actions</h2>
              
              <div className="space-y-3">
                {/* Assign New Task - Only for admin and manager */}
                {canAssignTasks() && (
                  <button className="w-full px-4 py-3 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
                    <FiCheckCircle className="w-4 h-4" />
                    <span>Assign New Task</span>
                  </button>
                )}
                
                {/* View Project History - Available for everyone */}
                <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <FiFolder className="w-4 h-4" />
                  <span>View Project History</span>
                </button>
                
                {/* View Work Reports - Available for everyone */}
                <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <FiActivity className="w-4 h-4" />
                  <span>View Work Reports</span>
                </button>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Completed "Dashboard Design"</div>
                  <div className="text-gray-500 text-xs">2 hours ago</div>
                </div>
                
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Updated project timeline</div>
                  <div className="text-gray-500 text-xs">Yesterday</div>
                </div>
                
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Attended team meeting</div>
                  <div className="text-gray-500 text-xs">2 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}