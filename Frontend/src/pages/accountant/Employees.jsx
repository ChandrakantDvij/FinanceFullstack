import { useEffect, useState } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { DataTable } from '@/components/dashboard/DataTable';
import { EmployeeModal } from '@/components/modals/EmployeeModal';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
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

//  Import Employee API
import employeeApi from '@/api/employeeApi';

export default function Employees() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  //  Fetch employees from backend
  const loadData = async () => {
    try {
      const employeesData = await employeeApi.getAllEmployees();
      // Normalize to ensure each row has a stable `id` for edit/delete
      const normalized = (Array.isArray(employeesData) ? employeesData : [])
        .map((e) => ({
          // unify id across possible backend shapes
          id: Number(e.id ?? e.employee_id ?? e.ID ?? e._id),
          name: e.name ?? e.full_name ?? e.employee_name ?? '',
          email: e.email ?? e.employee_email ?? '',
          phone: e.phone ?? e.mobile ?? e.contact_number ?? '',
          role: e.role ?? e.designation ?? '',
          // keep all original fields too (spread at end to avoid overriding normalized keys)
          ...e,
        }))
        .filter((e) => Number.isFinite(e.id) && e.id > 0);
      setEmployees(normalized);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load employees');
    }
  };

  //  Save employee (create or update)
  const handleSave = async (employee) => {
    try {
      const employeeId = employee.id ?? employee.employee_id ?? employee._id ?? employee.ID;

      // Normalize payload to what backend expects
      const normalizedPayload = {
        name: String(employee.name || '').trim(),
        email: employee.email ? String(employee.email).trim() : null,
        phone: employee.phone ? String(employee.phone).trim() : null,
      };

      if (normalizedPayload.phone && !/^\d{10}$/.test(normalizedPayload.phone)) {
        throw new Error('Phone must be a 10-digit number');
      }

      // Client-side duplicate email guard to avoid Sequelize "Validation error"
      if (!employeeId && normalizedPayload.email) {
        const lower = normalizedPayload.email.toLowerCase();
        const exists = employees.some((e) => String(e.email || '').toLowerCase() === lower);
        if (exists) {
          throw new Error('Email already exists');
        }
      }

      if (employeeId) {
        await employeeApi.updateEmployeeById(employeeId, normalizedPayload);
        toast.success('Employee updated successfully');
      } else {
        // Refresh list from server to guard against duplicates not in local state
        try {
          const serverEmployees = await employeeApi.getAllEmployees();
          const existsOnServer = (Array.isArray(serverEmployees) ? serverEmployees : [])
            .some((e) => String((e.email ?? '')).toLowerCase() === String(normalizedPayload.email ?? '').toLowerCase());
          if (existsOnServer) {
            throw new Error('Email already exists');
          }
        } catch (e) {
          // If fetching fails, continue to attempt create; backend will enforce constraints
        }

        await employeeApi.createEmployee(normalizedPayload);
        toast.success('Employee created successfully');
      }
      loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to save employee');
    }
  };

  //  Edit modal handler
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  //  Delete confirmation handler
  const handleDelete = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  //  Confirm delete
  const confirmDelete = async () => {
    if (employeeToDelete) {
      try {
        const employeeId = employeeToDelete.id ?? employeeToDelete.employee_id ?? employeeToDelete._id ?? employeeToDelete.ID;
        await employeeApi.deleteEmployeeById(employeeId);
        toast.success('Employee deleted successfully');
        loadData();
      } catch (error) {
        toast.error(error.message || 'Failed to delete employee');
      }
      setIsDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  //  Table columns (Removed Project field)
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role' },
  ];

  // Only add actions column for accountant role
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
            data={employees}
            columns={columns}
            onEdit={user?.role === 'accountant' ? handleEdit : undefined}
            onDelete={user?.role === 'accountant' ? handleDelete : undefined}
            onCreate={() => {
              setSelectedEmployee(null);
              setIsModalOpen(true);
            }}
            title="Employees"
            canCreate={user?.role === 'accountant'}
            canEdit={user?.role === 'accountant'}
            canDelete={user?.role === 'accountant'}
          />

          <EmployeeModal
            open={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedEmployee(null);
            }}
            onSave={handleSave}
            employee={selectedEmployee}
          />

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent className="animate-scale-in">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the employee{' '}
                  <strong>{employeeToDelete?.name}</strong>.
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
