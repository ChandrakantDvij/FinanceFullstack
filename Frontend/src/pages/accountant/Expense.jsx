import { useEffect, useState } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { DataTable } from '@/components/dashboard/DataTable';
import { ExpenseModal } from '@/components/modals/ExpenseModal';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
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

import expensesApi from "@/api/expensesApi";
import projectApi from "@/api/projectApi";
import expenseReviewApi from "@/api/expenseReviewApi";
import { ExpenseReviewModal } from '@/components/modals/ExpenseReviewModal';

function Expense() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedExpenseForReview, setSelectedExpenseForReview] = useState(null);
  const [expenseReviews, setExpenseReviews] = useState([]);
  
  // Debug modal state changes
  useEffect(() => {
    console.log('Modal state changed:', isModalOpen);
  }, [isModalOpen]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]); // For project dropdown

  useEffect(() => {
    loadData();
  }, [user?.role]);

  const loadData = async () => {
    setLoading(true);
    try {
      // First, let's get projects
      const projectsData = await projectApi.getAllProjects();
      console.log('Raw project data:', projectsData);
      
      // Handle projects data with detailed logging
      const projectsList = Array.isArray(projectsData.data) ? projectsData.data : projectsData?.data || [];
      console.log('Projects list before formatting:', projectsList);
      
      // Format projects for dropdown with better field mapping
      const formattedProjects = projectsList.map(project => {
        console.log('Processing project:', project);
        return {
          id: project.id,
          name: project.project_name
        };
      }).filter(project => project.id && project.name); // Only keep valid projects
      
      console.log('Final formatted projects:', formattedProjects);
      setProjects(formattedProjects);

      // Then get expenses
      const expensesData = await expensesApi.getAllExpenses();
      const expensesList = Array.isArray(expensesData) ? expensesData : expensesData?.data || [];

      // Load expense reviews for all roles to show status (reviewer, accountant, superadmin)
      try {
        const reviewsData = await expenseReviewApi.getAllExpenseReviews();
        setExpenseReviews(Array.isArray(reviewsData) ? reviewsData : reviewsData?.data || []);
      } catch (error) {
        console.error('Failed to load expense reviews:', error);
        setExpenseReviews([]);
      }

      setExpenses(expensesList);
    } catch (error) {
      console.error('Failed to load data:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };
const handleSave = async (expense) => {
    try {
      const expenseId = expense.id ?? expense.expense_id ?? expense.ID ?? expense._id;
      if (expenseId) {
        await expensesApi.updateExpenseById(expenseId,expense);
        toast.success('expense updated successfully');
      } else {
        await expensesApi.createExpense(expense);
        toast.success('expense created successfully');
      }
      loadData();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'Failed to save expense');
    }
  };


  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = (expense) => {
    setExpenseToDelete(expense);
    setIsDeleteDialogOpen(true);
  };

  // Handle create expense review (reviewer only)
  const handleCreateReview = (expense) => {
    setSelectedExpenseForReview(expense);
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = async (reviewData) => {
    try {
      await expenseReviewApi.createExpenseReview(reviewData);
      toast.success('Expense review created successfully');
      setIsReviewModalOpen(false);
      setSelectedExpenseForReview(null);
      loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to create expense review');
    }
  };

 
  const confirmDelete = async () => {
    if (expenseToDelete) {
      try {
        const expenseId = expenseToDelete.id ?? expenseToDelete.expense_id ?? expenseToDelete.ID ?? expenseToDelete._id;
        await expensesApi.deleteExpenseById(expenseId);
        toast.success('Expese deleted successfully');
        loadData();
      } catch (error) {
        toast.error(error.message || 'Failed to delete expense');
      }
      setIsDeleteDialogOpen(false);
      setExpenseToDelete(null);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status for an expense from expense reviews
  const getExpenseStatus = (expense) => {
    const expenseId = expense.id ?? expense.expense_id ?? expense.ID ?? expense._id;
    const review = expenseReviews.find(
      (r) => (r.expense_id ?? r.expenseId) === expenseId || String(r.expense_id ?? r.expenseId) === String(expenseId)
    );
    return review?.status || null;
  };

  const renderStatus = (status) => {
    if (!status) return <span className="text-muted-foreground">-</span>;
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
          statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const getExpenseComment = (expense) => {
  const expenseId = expense.id ?? expense.expense_id ?? expense.ID ?? expense._id;
  
  const review = expenseReviews.find(
    (r) =>
      (r.expense_id ?? r.expenseId) === expenseId ||
      String(r.expense_id ?? r.expenseId) === String(expenseId)
  );

  // Return comment if found, else null
  return review?.comment || null;
};
const renderComment = (comment) => {
  if (!comment) return <span className="text-muted-foreground italic">No comment</span>;
  return <span className="text-sm text-gray-700">{comment}</span>;
};

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'expense_type', label: 'Type', render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        value.toLowerCase() === 'recurring' ? 'bg-green-100 text-green-800' : 
        value.toLowerCase() === 'advance' ? 'bg-yellow-100 text-yellow-800' : ''
      }`}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </span>
    )},

    { key: 'amount', label: 'Amount', render: (value) => formatAmount(value) },
    { key: 'expense_date', label: 'Date', render: (value) => formatDate(value) },
    {key:'mode_of_payment', label:'Mode of Payment'},
    { key: 'description', label: 'Description' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value, row) => {
        const status = getExpenseStatus(row);
      
        return renderStatus(status);
      }
    },
    
    { 
      key: 'comments', 
      label: 'Comments', 
      render: (value, row) => {
        const comment = getExpenseComment(row);
      
        return renderComment(comment);
      }
    },
    // Review action column for reviewers
    ...(user?.role === 'reviewer' ? [{
      key: 'review_action',
      label: 'Action',
      render: (value, row) => (
       <Button
          variant="outline"
          size="sm"
          onClick={() => handleCreateReview(row)}
          className="hover:bg-purple-600 hover:text-white transition-all"
        >
          Create Review
        </Button>
      )
    }] : []),
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
            data={expenses}
            columns={columns}
            onEdit={user?.role === 'accountant' ? handleEdit : undefined}
            onDelete={user?.role === 'accountant' ? handleDelete : undefined}
            onCreate={() => {
              console.log('Add New button clicked');
              setSelectedExpense(null);
              setIsModalOpen(true);
              console.log('isModalOpen set to:', true);
            }}
            title="Expenses"
            canCreate={user?.role === 'accountant'}
            canEdit={user?.role === 'accountant'}
            canDelete={user?.role === 'accountant'}
            loading={loading}
          />


          <ExpenseModal
            open={isModalOpen}
            onClose={() => {
              console.log('Closing modal');
              setIsModalOpen(false);
              setSelectedExpense(null);
            }}
            onSave={handleSave}
            expense={selectedExpense}
            projects={projects}
          />

          {/* Expense Review Modal for Reviewer */}
          {user?.role === 'reviewer' && (
            <ExpenseReviewModal
              open={isReviewModalOpen}
              onClose={() => {
                setIsReviewModalOpen(false);
                setSelectedExpenseForReview(null);
              }}
              onSave={handleSaveReview}
              expense={selectedExpenseForReview}
            />
          )}

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent className="animate-scale-in">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the expense{' '}
                  <strong>{expenseToDelete?.title}</strong>.
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

export default Expense;