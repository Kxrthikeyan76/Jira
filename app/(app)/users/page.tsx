// app/(app)/users/page.tsx
"use client";

import { useState, useRef } from "react";
import { 
  FaUser, 
  FaUserPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaEnvelope,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaPhone,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaBuilding,
  FaCamera,
  FaImage,
  FaUpload,
  FaTimesCircle
} from "react-icons/fa";
import { Button, Card, Input, Container, Heading, Text, Badge } from "@/components/ui";

// Updated type definition with profile photo
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  phone: string;
  joinDate: string;
  status: "active" | "inactive";
  profilePhoto?: string; // Add profile photo URL/Base64
};

export default function UsersPage() {
  
  const [users, setUsers] = useState<User[]>([

  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state with profile photo
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    location: "",
    phone: "",
    profilePhoto: "", // Store as base64 string or URL
  });

  // Preview image state
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "",
      department: "",
      location: "",
      phone: "",
      profilePhoto: "",
    });
    setImagePreview(null);
    setEditingId(null);
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setFormData(prev => ({ ...prev, profilePhoto: base64String }));
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, profilePhoto: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.role) {
      alert("Please fill in required fields: Name, Email, and Role");
      return;
    }

    if (editingId) {
      // Update existing user - Keep their existing status
      setUsers(users.map(user => 
        user.id === editingId 
          ? { 
              ...user, 
              ...formData,
              id: editingId,
              // Keep existing status when editing
              status: users.find(u => u.id === editingId)?.status || "active"
            } 
          : user
      ));
    } else {
      // Add new user - Set status to "active" by default
      const newUser: User = {
        id: Date.now(),
        ...formData,
        status: "active", // All new members are active by default
        joinDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
      setUsers([...users, newUser]);
    }

    resetForm();
    setShowModal(false);
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      location: user.location,
      phone: user.phone,
      profilePhoto: user.profilePhoto || "",
    });
    setImagePreview(user.profilePhoto || null);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleStatusToggle = (id: number) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    ));
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Function to get avatar - uses photo or initials
  const getUserAvatar = (user: User) => {
    if (user.profilePhoto) {
      return (
        <img 
          src={user.profilePhoto} 
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
        />
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
        {getInitials(user.name)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Container size="xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
                <FaUsers className="text-2xl text-white" />
              </div>
              <div>
                <Heading level={1}>Team Members</Heading>
                <Text variant="muted">
  Manage {users.length} team members across {Array.from(new Set(users.map(u => u.department))).length} departments
</Text>
              </div>
            </div>
            
            <Button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              variant="primary"
              size="lg"
              leftIcon={<FaUserPlus />}
            >
              Add New Member
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 border-0">
              <div className="flex items-center justify-between">
                <div>
                  <Text size="sm" className="text-gray-600">Total Members</Text>
                  <Heading level={2}>{users.length}</Heading>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaUsers className="text-2xl text-blue-600" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border-0">
              <div className="flex items-center justify-between">
                <div>
                  <Text size="sm" className="text-gray-600">Active</Text>
                  <Heading level={2}>{users.filter(u => u.status === "active").length}</Heading>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaUserCheck className="text-2xl text-green-600" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border-0">
              <div className="flex items-center justify-between">
                <div>
                  <Text size="sm" className="text-gray-600">Departments</Text>
                  <Heading level={2}>{Array.from(new Set(users.map(u => u.department))).length}</Heading>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FaBuilding className="text-2xl text-orange-600" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border-0">
              <div className="flex items-center justify-between">
                <div>
                  <Text size="sm" className="text-gray-600">Inactive</Text>
                  <Heading level={2}>{users.filter(u => u.status === "inactive").length}</Heading>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaUserTimes className="text-2xl text-purple-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search Bar */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name, email, role, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 w-full"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={searchTerm ? "primary" : "secondary"}
                  onClick={() => setSearchTerm("")}
                  disabled={!searchTerm}
                >
                  Clear Search
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Users Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3}>
              All Team Members <Badge color="gray">{filteredUsers.length}</Badge>
            </Heading>
            <Text variant="muted">
              Showing {filteredUsers.length} of {users.length} members
            </Text>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="p-6 hover:shadow-lg transition-shadow group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar with photo */}
                      {getUserAvatar(user)}
                      <div>
                        <Heading level={4} className="mb-1">
                          {user.name}
                        </Heading>
                        <Badge color={user.status === "active" ? "green" : "gray"}>
                          {user.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-gray-500 hover:text-blue-600"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleStatusToggle(user.id)}
                        className="p-2 text-gray-500 hover:text-green-600"
                        title={user.status === "active" ? "Deactivate" : "Activate"}
                      >
                        {user.status === "active" ? <FaUserTimes /> : <FaUserCheck />}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-gray-500 hover:text-red-600"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FaBriefcase className="text-gray-400 flex-shrink-0" />
                      <span className="font-medium">{user.role}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaEnvelope className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaBuilding className="text-gray-400 flex-shrink-0" />
                      <span>{user.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCalendarAlt className="text-gray-400 flex-shrink-0" />
                      <span>Joined {user.joinDate}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaPhone className="text-gray-400" />
                        <span>{user.phone}</span>
                      </div>
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16">
              <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
              <Heading level={3} className="mb-2">
                {searchTerm ? "No members found" : "No team members yet"}
              </Heading>
              <Text className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? "Try adjusting your search terms"
                  : "Get started by adding your first team member"}
              </Text>
              <Button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                variant="primary"
                size="lg"
                leftIcon={<FaUserPlus />}
              >
                Add First Member
              </Button>
            </Card>
          )}
        </div>
      </Container>

      {/* Add/Edit Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-2xl">
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
                      {editingId ? "Edit Team Member" : "Add New Member"}
                    </Heading>
                    <Text variant="muted" size="sm">
                      {editingId ? "Update member details" : "Fill in the details below"}
                    </Text>
                  </div>
                </div>
                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Profile Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-6">
                    {/* Photo Preview */}
                    <div className="relative">
                      {imagePreview ? (
                        <>
                          <img 
                            src={imagePreview} 
                            alt="Preview"
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                          <button
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <FaTimesCircle size={16} />
                          </button>
                        </>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                          <FaUser size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="space-y-3">
                        <Button
                          type="button"
                          onClick={triggerFileInput}
                          variant="secondary"
                          leftIcon={<FaUpload />}
                          className="w-full"
                        >
                          Upload Photo
                        </Button>
                        <Text variant="muted" size="xs">
                          Recommended: Square image, max 5MB. JPG, PNG, or WebP.
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Role & Department */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <Input
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      placeholder="e.g., Frontend Developer, Product Manager"
                      className="w-full"
                    />
                    <Text variant="muted" size="xs" className="mt-1">
                      Enter the specific position
                    </Text>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <Input
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      placeholder="e.g., Engineering, Design, Marketing"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Location & Phone */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="City, State"
                        className="w-full pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                        className="w-full pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 rounded-b-2xl">
              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  disabled={!formData.name || !formData.email || !formData.role}
                  variant="primary"
                  size="lg"
                  leftIcon={<FaCheck />}
                  className="flex-1"
                >
                  {editingId ? "Update Member" : "Add Member"}
                </Button>
                <Button
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                  variant="secondary"
                  size="lg"
                  leftIcon={<FaTimes />}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}