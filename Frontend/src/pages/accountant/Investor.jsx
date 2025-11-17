import { useEffect, useState } from "react";
import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useAuth } from '@/contexts/AuthContext';
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Import your API
import investorApi from "@/api/investorApi";
// Import modal for adding/editing investor
import { InvestorModal } from "@/components/modals/InvestorModal"; // ✅ create this similar to ProjectModal

export default function Investor() {
  const { user } = useAuth();
  const [investors, setInvestors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [investorToDelete, setInvestorToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load investors on mount
  useEffect(() => {
    loadInvestors();
  }, []);

  // Fetch all investors
  const loadInvestors = async () => {
    setLoading(true);
    try {
      const data = await investorApi.getAllInvestors();
      const list = Array.isArray(data) ? data : data?.data || [];
      // Normalize id so update/delete work regardless of backend key
      const normalized = list.map((it) => ({
        id: it.id ?? it.investor_id ?? it.ID ?? it._id,
        ...it,
      }));
      setInvestors(normalized);
    } catch (error) {
      console.error("Failed to load investors:", error);
      toast.error(error.message || "Failed to load investors");
    } finally {
      setLoading(false);
    }
  };

  // Create or update investor
  const handleSave = async (investor) => {
    try {
      if (investor.id) {
        // Normalize payload to match backend expectations to avoid validation errors
        const normalizedStatusLower = String(investor.status || "")
          .replace(/\s+/g, "_")
          .toLowerCase();
        // Accept dd-mm-yyyy or yyyy-mm-dd
        let dateValue = investor.investment_date || investor.invested_date || "";
        if (/^\d{2}-\d{2}-\d{4}$/.test(dateValue)) {
          const [dd, mm, yyyy] = dateValue.split("-");
          dateValue = `${yyyy}-${mm}-${dd}`;
        }

        // Phone: backend likely expects exactly 10 digits
        const phoneRaw = String(investor.phone ?? investor.phone_number ?? "");
        const phoneDigits = phoneRaw.replace(/\D/g, "");
        if (phoneDigits.length !== 10) {
          toast.error("Phone must be a 10-digit number");
          return;
        }

        // Status: provide both lowercase and title-case to satisfy validators
        const statusTitle = normalizedStatusLower === "inactive" ? "Inactive" : "Active";
        const statusLower = normalizedStatusLower === "inactive" ? "inactive" : "active";

        // Build PATCH-like payload: include only changed fields
        const base = selectedInvestor || {};
        const calcAmount = Number(
          investor.invested_amount ?? investor.investment_amount ?? investor.amount ?? 0
        );
        const fields = {
          name: investor.name?.trim() || "",
          email: investor.email?.trim() || "",
          phone: phoneDigits,
          // invested_amount: calcAmount,
          // mode_of_payment: String(investor.mode_of_payment || "").toLowerCase(),
          // investment_date: dateValue,
          // description: investor.description ?? "",
          // status: statusLower,
          user_id: Number(investor.user_id),
          // project_id: Number(investor.project_id),
          // expense_id: Number(investor.expense_id),
        };

        const payload = {};
        Object.entries(fields).forEach(([key, value]) => {
          const prev = base[key];
          // Normalize previous for comparison
          const prevNorm =
            key === "investment_date" && typeof prev === "string"
              ? prev.split("T")[0]
              : key === "invested_amount"
              ? Number(prev)
              : key.endsWith("_id")
              ? Number(prev)
              : key === "status"
              ? String(prev || "").toLowerCase()
              : prev;
          const valueNorm =
            key === "status" ? String(value).toLowerCase() : value;
          if (
            (valueNorm ?? "") !== (prevNorm ?? "") && // changed
            value !== undefined && value !== null && value !== ""
          ) {
            payload[key] = value;
          }
        });

        // Provide aliases only for changed items
        if (payload.phone) payload.phone_number = payload.phone;
        if (payload.invested_amount !== undefined) {
          payload.investment_amount = payload.invested_amount;
          payload.amount = payload.invested_amount;
        }
        if (payload.mode_of_payment) {
          payload.payment_mode = payload.mode_of_payment; // alias
          payload.mode = payload.mode_of_payment; // extra alias
        }
        if (payload.status) payload.status_text = statusTitle; // alias

        if (Object.keys(payload).length === 0) {
          toast.success("Nothing to update");
          setIsModalOpen(false);
          return;
        }

        try {
          await investorApi.updateInvestorById(investor.id, payload);
        } catch (err) {
          // If backend does not allow partial PUT, retry with full payload once
          if (String(err.message || '').includes('(400)')) {
            const fullPayload = {
              name: fields.name,
              email: fields.email,
              phone: fields.phone,
              phone_number: fields.phone,
              // invested_amount: fields.invested_amount,
              // investment_amount: fields.invested_amount,
              // amount: fields.invested_amount,
              // mode_of_payment: fields.mode_of_payment,
              // payment_mode: String(fields.mode_of_payment || '').toLowerCase(),
              // investment_date: fields.investment_date,
              // description: fields.description,
              // status: fields.status,
              user_id: fields.user_id,
              // project_id: fields.project_id,
              // expense_id: fields.expense_id,
            };
            await investorApi.updateInvestorById(investor.id, fullPayload);
          } else {
            throw err;
          }
        }
        toast.success("Investor created successfully");
      } else {
        await investorApi.createInvestor(investor);
        toast.success("Investor updated successfully");
      }
      setIsModalOpen(false);
      loadInvestors();
    } catch (error) {
      toast.error(error.message || "Failed to save investor");
    }
  };

  // Edit handler
  const handleEdit = (investor) => {
    setSelectedInvestor(investor);
    setIsModalOpen(true);
  };

  // Delete handler
  const handleDelete = (investor) => {
    setInvestorToDelete(investor);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (investorToDelete) {
      try {
        await investorApi.deleteInvestorById(investorToDelete.id);
        toast.success("Investor deleted successfully");
        loadInvestors();
      } catch (error) {
        toast.error(error.message || "Failed to delete investor");
      } finally {
        setIsDeleteDialogOpen(false);
        setInvestorToDelete(null);
      }
    }
  };

  //  Table columns configuration
  const columns = [
    { key: "name", label: "Investor Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone Number" },
    // { key: "invested_amount", label: "Investment Amount" },
    // {key: "mode_of_payment", label: "Mode of Payment" },
    // { key: "investment_date", label: "Investment Date" },
    // {key:"description", label:"Description"},
    // {
    //   key: "status",
    //   label: "Status",
    //   render: (value) => (
    //     <span
    //       className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
    //         value === "active"
    //           ? "bg-green-100 text-green-800"
    //           : value === "inactive"
    //           ? "bg-gray-100 text-gray-800"
    //           : "bg-yellow-100 text-yellow-800"
    //       }`}
    //     >
    //       {String(value).replace(/_/g, " ")}
    //     </span>
    //   ),
    // },
    
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
            data={investors}
            columns={columns}
            // onEdit={handleEdit}
            // onDelete={handleDelete}
            onEdit={user?.role === 'accountant' ? handleEdit : undefined}
            onDelete={user?.role === 'accountant' ? handleDelete : undefined}
            onCreate={() => {
              setSelectedInvestor(null);
              setIsModalOpen(true);
            }}
            title="Investors"
            canCreate={user?.role === 'accountant'}
            canEdit={user?.role === 'accountant'}
            canDelete={user?.role === 'accountant'}
            loading={loading}
          />

          {/* 🔹 Investor Modal */}
          <InvestorModal
            open={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedInvestor(null);
            }}
            onSave={handleSave}
            investor={selectedInvestor}
          />

          {/* 🔹 Delete Confirmation Dialog */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent className="animate-scale-in">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete investor{" "}
                  <strong>{investorToDelete?.name}</strong>.
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
