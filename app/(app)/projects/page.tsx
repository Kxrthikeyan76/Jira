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
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Website Redesign",
      key: "WEB",
      description: "Complete overhaul of company website with modern design",
      progress: 65,
      issues: 42,
      openIssues: 12,
      lead: { name: "Alex Johnson", avatar: "AJ" },
      lastUpdated: "2 hours ago",
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "Mobile App",
      key: "MOB",
      description: "Development of cross-platform mobile application",
      progress: 40,
      issues: 89,
      openIssues: 24,
      lead: { name: "Maria Garcia", avatar: "MG" },
      lastUpdated: "1 day ago",
      color: "bg-purple-500"
    },
    {
      id: 3,
      name: "API Migration",
      key: "API",
      description: "Migrate legacy API to GraphQL with improved performance",
      progress: 85,
      issues: 56,
      openIssues: 8,
      lead: { name: "Sam Wilson", avatar: "SW" },
      lastUpdated: "3 hours ago",
      color: "bg-green-500"
    },
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ total: 0, active: 0, issues: 0, open: 0 });

  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");

  // Calculate stats
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

  const resetForm = () => {
    setName("");
    setKey("");
    setDescription("");
    setEditingId(null);
  };

  const handleSave = () => {
    if (!name || !key) return;

    if (editingId !== null) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingId ? { 
            ...p, 
            name, 
            key, 
            description,
            lastUpdated: "Just now"
          } : p
        )
      );
    } else {
      setProjects((prev) => [
        ...prev,
        { 
          id: Date.now(), 
          name, 
          key, 
          description,
          progress: 0,
          issues: 0,
          openIssues: 0,
          lead: { name: "You", avatar: "ME" },
          lastUpdated: "Just now",
          color: getRandomColor()
        },
      ]);
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
      <div className="max-w-7xl mx-auto">
        
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                  <FaFolder className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Projects
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage all organization projects and track progress
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="group relative px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
            >
              <FaPlus className="text-xl" />
              <span>Create Project</span>
            </button>
          </div>

         
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Total Projects", value: stats.total, icon: <FaFolder className="text-2xl" />, color: "bg-blue-100 text-blue-600" },
              { label: "Active", value: stats.active, icon: <FaSync className="text-2xl" />, color: "bg-green-100 text-green-600" },
              { label: "Total Issues", value: stats.issues, icon: <FaTasks className="text-2xl" />, color: "bg-purple-100 text-purple-600" },
              { label: "Open Issues", value: stats.open, icon: <FaExclamationTriangle className="text-2xl" />, color: "bg-orange-100 text-orange-600" },
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-lg ${stat.color.split(' ')[0]} flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects by name, key, or description..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>
        </div>

        
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
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
              </h2>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Website Revamp"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Key
                  </label>
                  <input
                    value={key}
                    onChange={(e) => setKey(e.target.value.toUpperCase())}
                    placeholder="WEB"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  <p className="text-xs text-gray-500 mt-2">Unique identifier for your project</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project goals, scope, and objectives..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSave}
                disabled={!name || !key}
                className={`px-8 py-3 font-semibold rounded-lg transition flex items-center gap-2
                  ${
                    !name || !key
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
              >
                <span>{editingId ? "Update" : "Create"}</span>
                <FaCheck className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
              >
                <span>Cancel</span>
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
               
                <div className={`absolute top-0 right-0 ${project.color} text-white px-4 py-1.5 rounded-bl-xl rounded-tr-2xl text-sm font-bold`}>
                  {project.key}
                </div>

                <div className="relative">
                  
                  <div className="mb-4">
                    <h3 
                      onClick={() => handleProjectClick(project.id)}
                      className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      {project.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                  </div>

                 
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
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
                      <div className="text-lg font-bold text-blue-600">{project.issues}</div>
                      <div className="text-xs text-gray-600">Issues</div>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">{project.openIssues}</div>
                      <div className="text-xs text-gray-600">Open</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{project.issues - project.openIssues}</div>
                      <div className="text-xs text-gray-600">Resolved</div>
                    </div>
                  </div>

                  {/* Footer with Actions */}
                  <div className="relative flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
                        <FaUser className="text-sm" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{project.lead.name}</div>
                        <div className="text-xs text-gray-500">Project Lead</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FaCalendarAlt className="w-3 h-3" />
                        <span>Updated {project.lastUpdated}</span>
                      </div>
                      
                      {/* Action Buttons - Bottom Right */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(project);
                          }}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Edit project"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(project);
                          }}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete project"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center mb-8">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <FaFolder className="text-6xl text-gray-400" />
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {searchTerm ? "No projects found" : "No projects yet"}
            </h2>
            <p className="text-gray-600 text-center max-w-md mb-8">
              {searchTerm 
                ? "Try different keywords or create a new project."
                : "Start your journey by creating your first project!"}
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
            >
              <FaPlus />
              <span>Create Your First Project</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}