import { useEffect, useState } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { DataTable } from '@/components/dashboard/DataTable';
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

//  Import your User Modal component
import { UserModal } from '@/components/modals/UserModal';

//  Import your User API
import userApi from '@/api/userApi';

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  //  Load user data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const usersData = await userApi.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load users');
    }
  };

 

  // Table columns with styling
  const columns = [
    { 
      key: 'name', 
      label: 'Name',
      render: (value) => (
        <div className="font-medium">{value}</div>
      )
    },
    { 
      key: 'email', 
      label: 'Email',
      render: (value) => (
        <div className="text-muted-foreground">{value}</div>
      )
    },

     { 
      key: 'phone', 
      label: 'Phone',
      render: (value) => (
        <div className="text-muted-foreground">{value}</div>
      )
    },
    { 
      key: 'role', 
      label: 'Role',
      render: (value) => {
        const roleColors = {
          superadmin: 'bg-purple-100 text-purple-800',
          accountant: 'bg-blue-100 text-blue-800',
          reviewer: 'bg-green-100 text-green-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    }
  ];

  return (
    <div className="flex w-full min-h-screen bg-background">
      <Sidebar role={user?.role || 'admin'} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          <DataTable
            data={users}
            columns={columns}
           
            onCreate={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            title="Users"
            canCreate={user?.role === 'superadmin'}
            canEdit={user?.role === 'superadmin'}
            canDelete={user?.role === 'superadmin'}
          />

          <UserModal
            open={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedUser(null);
            }}
            
            user={selectedUser}
          />

         
        </main>
      </div>
    </div>
  );
}
