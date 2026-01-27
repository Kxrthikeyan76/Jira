
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  FaFolder, 
  FaSync, 
  FaTasks, 
  FaExclamationTriangle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaCheck,
  FaCalendarAlt,
  FaKey,
  FaFileAlt,
  FaUser,
  FaLock
} from "react-icons/fa";
import {
  Button,
  Heading,
  Text,
  Card,
  Input,
  Badge,
  Container
} from "@/components/ui";

type Project = {
  id: number;
  name: string;
  key: string;
  description: string;
  progress: number;
  issues: number;
  openIssues: number;
  lead: { name: string; avatar: string };
  lastUpdated: string;
  color: string;
};

const getRandomColor = () => {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-indigo-500",
    "bg-pink-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomProgress = () => Math.floor(Math.random() * 30);
const getRandomIssues = () => Math.floor(Math.random() * 10);

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ total: 0, active: 0, issues: 0, open: 0 });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    key: "",
    description: ""
  });

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
    
    
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects);
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setStats({
      total: projects.length,
      active: projects.filter(p => p.progress < 100).length,
      issues: projects.reduce((sum, p) => sum + p.issues, 0),
      open: projects.reduce((sum, p) => sum + p.openIssues, 0),
    });
  }, [projects]);

  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, [projects]);

  
  const userRole = currentUser?.role || 'viewer';
  const canCreateProject = userRole === 'admin' || userRole === 'manager';
  const canEditProject = userRole === 'admin' || userRole === 'manager';
  const canDeleteProject = userRole === 'admin' || userRole === 'manager';
  const canViewProjects = true; // Everyone can view

  const getCurrentUserForProject = () => {
    if (currentUser) {
      return { 
        name: currentUser.name || "You", 
        avatar: (currentUser.name?.charAt(0) || "Y").toUpperCase() 
      };
    }
    return { name: "You", avatar: "ME" };
  };

  const resetForm = () => {
    setFormData({
      name: "",
      key: "",
      description: ""
    });
    setEditingId(null);
    setError("");
  };

  const handleSave = () => {
    setError("");

    if (!formData.name || !formData.key) {
      setError("Please fill in required fields: Project Name and Key");
      return;
    }

    const currentLead = getCurrentUserForProject();
    const timeAgo = "Just now";

    if (editingId !== null) {
      // Update existing project
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingId ? { 
            ...p, 
            name: formData.name, 
            key: formData.key.toUpperCase(), 
            description: formData.description,
            lastUpdated: timeAgo
          } : p
        )
      );
      
      alert("Project updated successfully!");
    } else {
      // Create new project
      const newProject: Project = {
        id: Date.now(),
        name: formData.name,
        key: formData.key.toUpperCase(),
        description: formData.description,
        progress: getRandomProgress(), 
        issues: getRandomIssues(), 
        openIssues: Math.floor(Math.random() * 5), 
        lead: currentLead,
        lastUpdated: timeAgo,
        color: getRandomColor()
      };

      setProjects((prev) => [...prev, newProject]);
      
      // Show success message
      alert(`Project "${formData.name}" created successfully!`);
    }

    resetForm();
    setShowModal(false);
  };

  const handleEdit = (project: Project) => {
    // ✅ SECURITY: Check if current user can edit projects
    if (!canEditProject) {
      alert("You don't have permission to edit projects");
      return;
    }

    setEditingId(project.id);
    setFormData({
      name: project.name,
      key: project.key,
      description: project.description
    });
    setShowModal(true);
  };

  const handleDelete = (project: Project) => {
    // ✅ SECURITY: Check if current user can delete projects
    if (!canDeleteProject) {
      alert("You don't have permission to delete projects");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`
    );
    if (!confirmed) return;

    setProjects((prev) => prev.filter((p) => p.id !== project.id));
    alert("Project deleted successfully!");
  };

  const handleProjectClick = (projectId: number) => {
    router.push(`/projects/${projectId}`);
  };

  // Filtered projects
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading if no user data yet
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Text>Loading projects...</Text>
        </div>
      </div>
    );
  }

  // Check if user can view projects
  if (!canViewProjects) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <FaFolder className="text-6xl text-gray-300 mx-auto mb-4" />
          <Heading level={2} className="mb-2">Access Denied</Heading>
          <Text className="text-gray-600 mb-6">
            You don't have permission to view projects.
          </Text>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
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
                  <FaFolder className="text-2xl text-white" />
                </div>
                <div>
                  <Heading level={1}>Projects</Heading>
                  <Text variant="muted">
                    {projects.length === 0 
                      ? "Create your first project to get started" 
                      : `Manage ${projects.length} organization projects`}
                  </Text>
                </div>
              </div>

              {/* Create Project Button - Only for admin/manager */}
              {canCreateProject && (
                <Button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  variant="primary"
                  size="lg"
                >
                  <span className="flex items-center gap-2">
                    <FaPlus /> Create Project
                  </span>
                </Button>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                { 
                  label: "Total Projects", 
                  value: stats.total, 
                  icon: <FaFolder className="text-2xl" />, 
                  color: "blue",
                  bgColor: "bg-blue-100",
                  textColor: "text-blue-600"
                },
                { 
                  label: "Active", 
                  value: stats.active, 
                  icon: <FaSync className="text-2xl" />, 
                  color: "green",
                  bgColor: "bg-green-100",
                  textColor: "text-green-600"
                },
                { 
                  label: "Total Issues", 
                  value: stats.issues, 
                  icon: <FaTasks className="text-2xl" />, 
                  color: "purple",
                  bgColor: "bg-purple-100",
                  textColor: "text-purple-600"
                },
                { 
                  label: "Open Issues", 
                  value: stats.open, 
                  icon: <FaExclamationTriangle className="text-2xl" />, 
                  color: "orange",
                  bgColor: "bg-orange-100",
                  textColor: "text-orange-600"
                },
              ].map((stat, index) => (
                <Card 
                  key={index}
                  className="p-6 border-0"
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <div className={`text-2xl ${stat.textColor}`}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-right">
                      <Heading level={2} className="text-gray-900">
                        {stat.value}
                      </Heading>
                      <Text variant="muted" size="sm">
                        {stat.label}
                      </Text>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Search Bar */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search projects by name, key, or description..."
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

          

          {/* Projects Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Heading level={3}>
                All Projects <Badge color="gray">{filteredProjects.length}</Badge>
              </Heading>
              <Text variant="muted">
                Showing {filteredProjects.length} of {stats.total} projects
              </Text>
            </div>

            {filteredProjects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    hoverable
                    className="relative overflow-hidden group"
                  >
                    {/* Project Key Badge */}
                    <div className={`absolute top-0 right-0 ${project.color} text-white px-4 py-1.5 rounded-bl-xl rounded-tr-2xl text-sm font-bold`}>
                      {project.key}
                    </div>

                    <div className="relative">
                      {/* Project Info */}
                      <div className="mb-4">
                        <div 
                          onClick={() => handleProjectClick(project.id)}
                          className="cursor-pointer"
                        >
                          <Heading 
                            level={3}
                            className="mb-2 hover:text-blue-600 transition-colors"
                          >
                            {project.name}
                          </Heading>
                        </div>
                        <Text variant="muted" size="sm" className="line-clamp-2">
                          {project.description}
                        </Text>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <Text size="sm" className="font-medium text-gray-700">
                            Progress
                          </Text>
                          <Text size="sm" className="font-bold text-gray-900">
                            {project.progress}%
                          </Text>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${project.color} rounded-full transition-all duration-300 ease-out`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                          <Text size="lg" className="font-bold text-blue-600">
                            {project.issues}
                          </Text>
                          <Text variant="muted" size="xs">
                            Issues
                          </Text>
                        </div>
                        <div className="text-center p-2 bg-orange-50 rounded-lg">
                          <Text size="lg" className="font-bold text-orange-600">
                            {project.openIssues}
                          </Text>
                          <Text variant="muted" size="xs">
                            Open
                          </Text>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                          <Text size="lg" className="font-bold text-green-600">
                            {project.issues - project.openIssues}
                          </Text>
                          <Text variant="muted" size="xs">
                            Resolved
                          </Text>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="relative flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
                            {project.lead.avatar}
                          </div>
                          <div>
                            <Text size="sm" className="font-medium text-gray-900">
                              {project.lead.name}
                            </Text>
                            <Text variant="muted" size="xs">
                              Project Lead
                            </Text>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                            <Text variant="muted" size="xs">
                              {project.lastUpdated}
                            </Text>
                          </div>
                          
                          {/* Action Buttons - Only for admin/manager */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {canEditProject && (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(project);
                                }}
                                variant="ghost"
                                size="sm"
                                className="p-2"
                                title="Edit project"
                              >
                                <FaEdit className="w-4 h-4" />
                              </Button>
                            )}
                            {canDeleteProject && (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(project);
                                }}
                                variant="secondary"
                                size="sm"
                                className="p-2"
                                title="Delete project"
                              >
                                <FaTrash className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-16">
                <FaFolder className="text-6xl text-gray-300 mx-auto mb-4" />
                <Heading level={3} className="mb-2">
                  {searchTerm ? "No projects found" : "No projects yet"}
                </Heading>
                <Text className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm 
                    ? "Try adjusting your search terms"
                    : "Start by creating your first project to organize your work!"}
                </Text>
                {canCreateProject && (
                  <Button
                    onClick={() => {
                      resetForm();
                      setShowModal(true);
                    }}
                    variant="primary"
                    size="lg"
                  >
                    <span className="flex items-center gap-2">
                      <FaPlus /> Create First Project
                    </span>
                  </Button>
                )}
              </Card>
            )}
          </div>
        </Container>
      </div>

      {/* ✅ FIXED: MODAL OUTSIDE MAIN CONTENT */}
      {showModal && canEditProject && (
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
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] mx-4 overflow-hidden z-50">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {editingId ? (
                      <FaEdit className="text-xl text-blue-600" />
                    ) : (
                      <FaPlus className="text-xl text-green-600" />
                    )}
                  </div>
                  <div>
                    <Heading level={2}>
                      {editingId ? "Edit Project" : "Create New Project"}
                    </Heading>
                    <Text variant="muted" size="sm">
                      {editingId ? "Update project details" : "Fill in the project details below"}
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

                <div className="space-y-6">
                  {/* Project Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Website Redesign"
                      className="w-full"
                    />
                  </div>

                  {/* Project Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Key *
                    </label>
                    <div className="relative">
                      <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                      <Input
                        value={formData.key}
                        onChange={(e) => setFormData({...formData, key: e.target.value})}
                        placeholder="e.g., WEB (2-4 letters)"
                        className="w-full pl-10"
                      />
                    </div>
                    <Text variant="muted" size="xs" className="mt-1">
                      Short unique code that will appear in project badges
                    </Text>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <div className="relative">
                      <FaFileAlt className="absolute left-3 top-3 text-gray-400 z-10" />
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Describe what this project is about, its goals, and scope..."
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                      />
                    </div>
                  </div>

                  {/* Project Preview (when editing) */}
                  {editingId && (
                    <div className="pt-4 border-t">
                      <Text size="sm" className="font-medium text-gray-700 mb-3">
                        Project Preview
                      </Text>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <FaFolder className="text-blue-600" />
                          </div>
                          <div>
                            <Text className="font-medium">{formData.name}</Text>
                            <Text size="sm" variant="muted">
                              Key: {formData.key.toUpperCase()}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Permission Info */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FaLock className="text-blue-600 mt-0.5" />
                      <div>
                        <Text size="sm" className="font-medium text-blue-800">
                          Permission Information
                        </Text>
                        <Text size="xs" className="text-blue-700 mt-1">
                          {currentUser?.role === 'admin' || currentUser?.role === 'manager'
                            ? "You have permission to create and manage projects."
                            : "You have view-only access to projects."}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t px-6 py-4">
              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  disabled={!formData.name || !formData.key}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                >
                  <span className="flex items-center gap-2">
                    <FaCheck /> {editingId ? "Update Project" : "Create Project"}
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