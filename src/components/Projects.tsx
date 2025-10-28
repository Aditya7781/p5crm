import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Download } from 'lucide-react';
import ProjectModal from './modals/ProjectModal';
import { downloadProjectsCSV } from '../utils/downloadUtils';

interface Project {
  id: number;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  date: string;
  estValue: number;
  confirmationBy: string;
  projectLead: string;
  sentToAccounting: boolean;
  billingStatus: string;
  gstFilingStatus: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      clientId: 'CL001',
      clientName: 'Tech Solutions Ltd',
      clientPhone: '+91 9876543210',
      clientEmail: 'contact@techsolutions.com',
      date: '2025-01-15',
      estValue: 150000,
      confirmationBy: 'Email',
      projectLead: 'Digital Solutions',
      sentToAccounting: true,
      billingStatus: 'Completed',
      gstFilingStatus: 'Filed',
    },
    {
      id: 2,
      clientId: 'CL002',
      clientName: 'Creative Agency',
      clientPhone: '+91 9876543211',
      clientEmail: 'hello@creativeagency.com',
      date: '2025-01-10',
      estValue: 200000,
      confirmationBy: 'Phone',
      projectLead: 'Ravi Coordinator',
      sentToAccounting: false,
      billingStatus: 'Pending',
      gstFilingStatus: 'Pending',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter(project =>
    project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.clientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProject = (projectData: Omit<Project, 'id'>) => {
    const newProject = {
      ...projectData,
      id: Math.max(...projects.map(p => p.id), 0) + 1,
    };
    setProjects([...projects, newProject]);
  };

  const handleEditProject = (projectData: Omit<Project, 'id'>) => {
    if (editingProject) {
      setProjects(projects.map(p => 
        p.id === editingProject.id ? { ...projectData, id: editingProject.id } : p
      ));
      setEditingProject(null);
    }
  };

  const handleDeleteProject = (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Filed': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-orange-100 text-orange-800',
    };
    return `px-2 py-1 text-xs rounded-full ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
          <p className="text-gray-600 mt-2">Manage your client projects and billing status</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => downloadProjectsCSV(filteredProjects)}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Download CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Project
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by project name or client ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{project.clientName}</div>
                      <div className="text-sm text-gray-500">ID: {project.clientId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{project.clientPhone}</div>
                      <div className="text-sm text-gray-500">{project.clientEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">₹{project.estValue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{project.date}</div>
                      <div className="text-sm text-gray-500">Lead: {project.projectLead}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className={getStatusBadge(project.billingStatus)}>
                        {project.billingStatus}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">
                        A/c: {project.sentToAccounting ? 'Sent' : 'Pending'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className={getStatusBadge(project.gstFilingStatus)}>
                        GST: {project.gstFilingStatus}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">
                        Confirmed: {project.confirmationBy}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(project)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ProjectModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={editingProject ? handleEditProject : handleAddProject}
          initialData={editingProject}
        />
      )}
    </div>
  );
};

export default Projects;