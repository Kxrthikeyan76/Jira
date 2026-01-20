"use client";

import { useState, useEffect } from "react";
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
  FaUser,
  FaCalendarAlt
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

export default function ProjectsPage() {
  const router = useRouter();
  
 
  const [projects, setProjects] = useState<Project[]>([]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ total: 0, active: 0, issues: 0, open: 0 });

  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setStats({
      total: projects.length,
      active: projects.filter(p => p.progress < 100).length,
      issues: projects.reduce((sum, p) => sum + p.issues, 0),
      open: projects.reduce((sum, p) => sum + p.openIssues, 0),
    });
  }, [projects]);

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

  const getCurrentUser = () => {
   
    return { name: "You", avatar: "ME" };
  };

  const getRandomProgress = () => {
    
    return Math.floor(Math.random() * 30);
  };

  const getRandomIssues = () => {
   
    return Math.floor(Math.random() * 10);
  };

  const resetForm = () => {
    setName("");
    setKey("");
    setDescription("");
    setEditingId(null);
  };

  const handleSave = () => {
    if (!name || !key) return;

    const currentUser = getCurrentUser();
    const now = new Date();
    const timeAgo = "Just now";

    if (editingId !== null) {
     
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingId ? { 
            ...p, 
            name, 
            key: key.toUpperCase(), 
            description,
            lastUpdated: timeAgo
          } : p
        )
      );
    } else {
      
      const newProject: Project = {
        id: Date.now(),
        name,
        key: key.toUpperCase(),
        description,
        progress: getRandomProgress(), 
        issues: getRandomIssues(), 
        openIssues: Math.floor(Math.random() * 5), 
        lead: currentUser,
        lastUpdated: timeAgo,
        color: getRandomColor()
      };

      setProjects((prev) => [...prev, newProject]);
    }

    resetForm();
    setShowForm(false);
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setName(project.name);
    setKey(project.key);
    setDescription(project.description);
    setShowForm(true);
  };

  const handleDelete = (project: Project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`
    );
    if (!confirmed) return;

    setProjects((prev) => prev.filter((p) => p.id !== project.id));
  };

  const handleProjectClick = (projectId: number) => {
    router.push(`/projects/${projectId}`);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Container size="xl">
        
        <Card padding="lg" className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                  <FaFolder className="text-2xl text-white" />
                </div>
                <div>
                  <Heading level={1}>Projects</Heading>
                  <Text variant="muted" size="sm">
                    {projects.length === 0 
                      ? "Create your first project to get started" 
                      : `Manage ${projects.length} organization projects`}
                  </Text>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              variant="primary"
              size="lg"
              leftIcon={<FaPlus className="text-xl" />}
            >
              Create Project
            </Button>
          </div>

         
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Total Projects", value: stats.total, icon: <FaFolder className="text-2xl" />, color: "blue" },
              { label: "Active", value: stats.active, icon: <FaSync className="text-2xl" />, color: "green" },
              { label: "Total Issues", value: stats.issues, icon: <FaTasks className="text-2xl" />, color: "purple" },
              { label: "Open Issues", value: stats.open, icon: <FaExclamationTriangle className="text-2xl" />, color: "orange" },
            ].map((stat, index) => (
              <Card 
                key={index}
                padding="md"
                hoverable
                className="border-0"
              >
                <div className="flex items-center justify-between">
                  <Badge color={stat.color as any} className="!px-4 !py-3">
                    {stat.icon}
                  </Badge>
                  <div className="text-right">
                    <Heading level={3} className="text-gray-900">
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

         
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects by name, key, or description..."
                className="pl-10"
              />
            </div>
          </div>
        </Card>

        
        {showForm && (
          <Card padding="lg" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Heading level={2} className="flex items-center gap-2">
                {editingId ? (
                  <>
                    <FaEdit className="text-blue-600" />
                    Edit Project
                  </>
                ) : (
                  <>
                    <FaPlus className="text-green-600" />
                    Create New Project
                  </>
                )}
              </Heading>
              <Button
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                <FaTimes className="w-6 h-6 text-gray-500" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Text size="sm" className="font-medium text-gray-700 mb-2">
                    Project Name
                  </Text>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Website Redesign"
                  />
                </div>

                <div>
                  <Text size="sm" className="font-medium text-gray-700 mb-2">
                    Project Key
                  </Text>
                  <Input
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="e.g., WEB"
                  />
                  <Text variant="muted" size="xs" className="mt-2">
                    Short unique code (2-4 letters)
                  </Text>
                </div>
              </div>

              <div>
                <Text size="sm" className="font-medium text-gray-700 mb-2">
                  Description
                </Text>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this project is about..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button
                onClick={handleSave}
                disabled={!name || !key}
                variant={!name || !key ? "secondary" : "primary"}
                size="lg"
                leftIcon={<FaCheck className="w-5 h-5" />}
              >
                {editingId ? "Update Project" : "Create Project"}
              </Button>

              <Button
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                variant="secondary"
                size="lg"
                leftIcon={<FaTimes className="w-5 h-5" />}
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                hoverable
                className="relative overflow-hidden group"
              >
               
                <div className={`absolute top-0 right-0 ${project.color} text-white px-4 py-1.5 rounded-bl-xl rounded-tr-2xl text-sm font-bold`}>
                  {project.key}
                </div>

                <div className="relative">
                  
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
                      
                      
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(project);
                          }}
                          variant="danger"
                          size="sm"
                          className="p-2"
                          title="Delete project"
                        >
                          <FaTrash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          
          <Card className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center mb-8">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <FaFolder className="text-6xl text-gray-400" />
                </div>
              </div>
            </div>
            <Heading level={2} className="text-gray-900 mb-4 text-center">
              {searchTerm ? "No projects found" : "No projects yet"}
            </Heading>
            <Text variant="muted" className="text-center max-w-md mb-8">
              {searchTerm 
                ? "Try different keywords or create a new project."
                : "Start by creating your first project to organize your work!"}
            </Text>
            <Button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              variant="primary"
              size="lg"
              leftIcon={<FaPlus />}
            >
              Create Your First Project
            </Button>
          </Card>
        )}
      </Container>
    </div>
  );
}