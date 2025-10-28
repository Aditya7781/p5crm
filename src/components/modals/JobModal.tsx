import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Job {
  id: number;
  project: string;
  projectId: string;
  description: string;
  projectValue: number;
  designers: string;
  frontend: string;
  backend: string;
  createdOn: string;
  deadline: string;
  overdue: boolean;
  status: string;
  awsDetails: string;
  figmaFile: string;
  holdReassign: boolean;
}

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Job, 'id'>) => void;
  initialData?: Job | null;
}

const JobModal: React.FC<JobModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    project: '',
    projectId: '',
    description: '',
    projectValue: 0,
    designers: '',
    frontend: '',
    backend: '',
    createdOn: '',
    deadline: '',
    overdue: false,
    status: 'Pending',
    awsDetails: '',
    figmaFile: '',
    holdReassign: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        project: initialData.project,
        projectId: initialData.projectId,
        description: initialData.description,
        projectValue: initialData.projectValue,
        designers: initialData.designers,
        frontend: initialData.frontend,
        backend: initialData.backend,
        createdOn: initialData.createdOn,
        deadline: initialData.deadline,
        overdue: initialData.overdue,
        status: initialData.status,
        awsDetails: initialData.awsDetails,
        figmaFile: initialData.figmaFile,
        holdReassign: initialData.holdReassign,
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        project: '',
        projectId: '',
        description: '',
        projectValue: 0,
        designers: '',
        frontend: '',
        backend: '',
        createdOn: today,
        deadline: '',
        overdue: false,
        status: 'Pending',
        awsDetails: '',
        figmaFile: '',
        holdReassign: false,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if overdue
    const today = new Date();
    const deadlineDate = new Date(formData.deadline);
    const isOverdue = deadlineDate < today && formData.status !== 'Completed';
    
    onSubmit({
      ...formData,
      overdue: isOverdue,
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked 
              : type === 'number' ? Number(value) 
              : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? 'Edit Job' : 'Add New Job'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <input
                type="text"
                name="project"
                value={formData.project}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project ID
              </label>
              <input
                type="text"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Value (₹)
              </label>
              <input
                type="number"
                name="projectValue"
                value={formData.projectValue}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designers
              </label>
              <input
                type="text"
                name="designers"
                value={formData.designers}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Comma separated names"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frontend Developer
              </label>
              <input
                type="text"
                name="frontend"
                value={formData.frontend}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Backend Developer
              </label>
              <input
                type="text"
                name="backend"
                value={formData.backend}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Created On
              </label>
              <input
                type="date"
                name="createdOn"
                value={formData.createdOn}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Delayed">Delayed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AWS Details
              </label>
              <input
                type="text"
                name="awsDetails"
                value={formData.awsDetails}
                onChange={handleChange}
                placeholder="e.g., EC2, S3, RDS configured"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Figma File URL
              </label>
              <input
                type="url"
                name="figmaFile"
                value={formData.figmaFile}
                onChange={handleChange}
                placeholder="https://figma.com/design/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="holdReassign"
                checked={formData.holdReassign}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Hold/Re-assign</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {initialData ? 'Update Job' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobModal;