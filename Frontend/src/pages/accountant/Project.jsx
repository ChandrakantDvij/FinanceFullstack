import { useEffect, useState } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { DataTable } from '@/components/dashboard/DataTable';
import { ProjectModal } from '@/components/modals/ProjectModal';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

// Import Project API
import projectApi from '@/api/projectApi';
import projectAssignmentApi from '@/api/projectAssignment';
import { ProjectAssignmentModal } from '@/components/modals/ProjectAssignmentModal';

const PAGE_SIZE = 10;

export default function Project() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projectAssignments, setProjectAssignments] = useState({}); // Store assignments by project ID
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedProjectForAssignment, setSelectedProjectForAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: PAGE_SIZE,
  });

  useEffect(() => {
    loadData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch projects from backend
  const loadData = async (page = paginationInfo.currentPage || 1) => {
    setLoading(true);
    try {
      const response = await projectApi.getAllProjects({
        page,
        limit: PAGE_SIZE,
      });
      const projectsArray = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];
      setProjects(projectsArray);

      const pagination = response?.pagination;
      setPaginationInfo({
        currentPage: pagination?.currentPage || page,
        totalPages: pagination?.totalPages || 1,
        totalRecords:
          typeof pagination?.totalRecords === 'number'
            ? pagination.totalRecords
            : projectsArray.length,
        limit: PAGE_SIZE,
      });

      // Load project assignments for each project
      const assignmentsMap = {};
      if (projectsArray.length > 0) {
        await Promise.all(
          projectsArray.map(async (project) => {
            const projectId =
              project.id ?? project.project_id ?? project.ID ?? project._id;
            if (projectId) {
              try {
                const assignments = await projectAssignmentApi.getProjectAssignmentById(projectId);
                assignmentsMap[projectId] = Array.isArray(assignments) ? assignments : [];
              } catch (error) {
                // If no assignments found or error, set empty array
                assignmentsMap[projectId] = [];
              }
            }
          })
        );
      }
      setProjectAssignments(assignmentsMap);
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || 'Failed to load projects';
      if (typeof message === 'string' && message.toLowerCase().includes('no projects found')) {
        setProjects([]);
        setProjectAssignments({});
        setPaginationInfo({
          currentPage: 1,
          totalPages: 1,
          totalRecords: 0,
          limit: PAGE_SIZE,
        });
      } else {
        console.error('Failed to load projects:', error);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Save project (create or update)
  const handleSave = async (project) => {
    try {
      const projectId = project.id ?? project.project_id ?? project.ID ?? project._id;
      if (projectId) {
        await projectApi.updateProjectById(projectId, project);
        toast.success('Project updated successfully');
      } else {
        await projectApi.createProject(project);
        toast.success('Project created successfully');
      }
      if (projectId) {
        loadData(paginationInfo.currentPage || 1);
      } else {
        loadData(1);
        setPaginationInfo((prev) => ({
          ...prev,
          currentPage: 1,
        }));
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'Failed to save project');
    }
  };

  // Edit modal handler
  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Delete confirmation handler
  const handleDelete = (project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (projectToDelete) {
      try {
        const projectId = projectToDelete.id ?? projectToDelete.project_id ?? projectToDelete.ID ?? projectToDelete._id;
        await projectApi.deleteProjectById(projectId);
        toast.success('Project deleted successfully');
        const shouldGoToPreviousPage =
          projects.length === 1 && (paginationInfo.currentPage || 1) > 1;
        const targetPage = shouldGoToPreviousPage
          ? (paginationInfo.currentPage || 1) - 1
          : paginationInfo.currentPage || 1;
        loadData(targetPage);
      } catch (error) {
        toast.error(error.message || 'Failed to delete project');
      }
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  // Handle assign employees (accountant only)
  const handleAssignEmployees = (project) => {
    setSelectedProjectForAssignment(project);
    setIsAssignmentModalOpen(true);
  };

  const handleSaveAssignment = async (assignmentData) => {
    try {
      await projectAssignmentApi.createProjectAssignment(assignmentData);
      toast.success('Employees assigned to project successfully');
      setIsAssignmentModalOpen(false);
      setSelectedProjectForAssignment(null);
      loadData(paginationInfo.currentPage || 1);
    } catch (error) {
      toast.error(error.message || 'Failed to assign employees');
    }
  };

  // Format currency for budget display
  const formatBudget = (budget) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(budget);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get assignees for a project from project assignments
  const getProjectAssignees = (project) => {
    const projectId = project.id ?? project.project_id ?? project.ID ?? project._id;
    if (!projectId || !projectAssignments[projectId]) {
      return [];
    }
    return projectAssignments[projectId];
  };

  // Render assignees column
  const renderAssignees = (project) => {
    const assignments = getProjectAssignees(project);
    if (assignments.length === 0) {
      return <span className="text-muted-foreground">-</span>;
    }
    
    // Extract employee names from assignments
    const employeeNames = assignments
      .map(assignment => assignment.employee_name)
      .filter(name => name && name !== 'N/A' && name.trim() !== '')
      .filter((name, index, array) => array.indexOf(name) === index); // Remove duplicates
    
    if (employeeNames.length === 0) {
      return <span className="text-muted-foreground">-</span>;
    }
    
    // Display employee names vertically
    return (
      <div className="flex flex-col gap-1">
        {employeeNames.map((name, index) => (
          <span
            key={index}
            className="text-xs font-semibold"
          >
            {name}
          </span>
        ))}
      </div>
    );
  };

  // Table columns configuration
  const rolePathSegment =
    user?.role === 'superadmin'
      ? 'superadmin'
      : user?.role === 'reviewer'
      ? 'reviewer'
      : 'accountant';

  const columns = [
    {
      key: 'name',
      label: 'Project Name',
      render: (value, row) => {
        const projectId = row.id ?? row.project_id ?? row.ID ?? row._id;
        if (!projectId) {
          return value || '-';
        }
        return (
          <button
            type="button"
            onClick={() => navigate(`/${rolePathSegment}/projects/${projectId}`)}
            className="text-primary hover:underline font-semibold"
          >
            {value || `Project #${projectId}`}
          </button>
        );
      },
    },
    { key: 'department', label: 'Department' },
    { key: 'sub_department', label: 'Sub Department' },
    { key: 'location', label: 'Location' },
    {key:'product',label:'product'},
  
    
    {key:'quantity', label: 'Quantity' },
    {key:'description', label: 'Description' },

    { 
      key: 'estimated_budget', 
      label: 'Budget',
      render: (value) => formatBudget(value)
    },
    { 
      key: 'start_date', 
      label: 'Start Date',
      render: (value) => formatDate(value)
    },
    { 
      key: 'end_date', 
      label: 'End Date',
      render: (value) => formatDate(value)
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize
          ${value === 'completed' ? 'bg-green-100 text-green-800' :
            value === 'inprogress' ? 'bg-blue-100 text-blue-800' :
            value === 'planned' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'}`}>
          {String(value).replace(/_/g, ' ')}
        </span>
      )
    },
    {
      key: 'assignees',
      label: 'Assignees',
      render: (value, row) => renderAssignees(row)
    },
    // Assign action column for accountant only
    ...(user?.role === 'accountant' ? [{
      key: 'assign_action',
      label: 'Employee Assignment',
      render: (value, row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAssignEmployees(row)}
          className="hover:bg-purple-600 hover:text-white transition-all"
        >
          Assign Employees
        </Button>
      )
    }] : []),
    {
      key: 'analytics',
      label: 'Analytics',
      render: (value, row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/accountant/projects/${row.id ?? row.project_id}/analytics`)}
          className="hover:bg-blue-600 hover:text-white transition-all"
        >
          View Analytics
        </Button>
      )
    },
  ];

  if (user?.role === 'accountant') {
    columns.push({
      key: 'actions',
      label: 'Actions',
      render: (_val, row) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => handleEdit(row)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(row)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    });
  }

  return (
    <div className="flex w-full min-h-screen bg-background">
      <Sidebar role={user?.role || 'accountant'} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          <DataTable
            data={projects}
            columns={columns}
            onEdit={user?.role === 'accountant' ? handleEdit : undefined}
            onDelete={user?.role === 'accountant' ? handleDelete : undefined}
            onCreate={() => {
              setSelectedProject(null);
              setIsModalOpen(true);
            }}
            title="Projects"
            canCreate={user?.role === 'accountant'}
            canEdit={user?.role === 'accountant'}
            canDelete={user?.role === 'accountant'}
            loading={loading}
          pagination={{
            ...paginationInfo,
            onPageChange: (page) => {
              if (!page || page === paginationInfo.currentPage) return;
              const clampedPage = Math.max(
                1,
                Math.min(page, paginationInfo.totalPages || 1)
              );
              loadData(clampedPage);
            },
          }}
          />

          <ProjectModal
            open={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedProject(null);
            }}
            onSave={handleSave}
            project={selectedProject}
          />

          {/* Project Assignment Modal for Accountant */}
          {user?.role === 'accountant' && (
            <ProjectAssignmentModal
              open={isAssignmentModalOpen}
              onClose={() => {
                setIsAssignmentModalOpen(false);
                setSelectedProjectForAssignment(null);
              }}
              onSave={handleSaveAssignment}
              project={selectedProjectForAssignment}
            />
          )}

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent className="animate-scale-in">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the project{' '}
                  <strong>{projectToDelete?.name}</strong>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    </div>
  );
}