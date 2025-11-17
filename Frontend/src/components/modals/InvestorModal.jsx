import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import projectApi from "@/api/projectApi";
import expensesApi from "@/api/expensesApi";
import { useAuth } from "@/contexts/AuthContext";
import employeeApi from "@/api/employeeApi";

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

const modeOfPaymentOptions = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "upi", label: "UPI" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
];

export function InvestorModal({ open, onClose, onSave, investor = null }) {
  const { user } = useAuth();
  const defaultUserId = useMemo(() => {
    return Number(user?.id || user?.user_id || 0);
  }, [user]);

  const getInitialFormState = () =>
    investor
      ? {
          id:
            investor.id ??
            investor.investor_id ??
            investor.ID ??
            investor._id ??
            null,
          name: investor.name || "",
          email: investor.email || "",
          phone: investor.phone || "",
          // invested_amount: investor.invested_amount?.toString() || "",
          // mode_of_payment: investor.mode_of_payment || "",
          // investment_date: investor.investment_date?.split("T")[0] || "",
          // description: investor.description || "",
          // status: investor.status?.toLowerCase() || "",
          user_id: investor.user_id || defaultUserId,
          // project_id: investor.project_id?.toString() || "",
          // expense_id: investor.expense_id?.toString() || "",
          // employee_id: investor.employee_id?.toString() || "",
        }
      : {
          id: null,
          name: "",
          email: "",
          phone: "",
          // invested_amount: "",
          // mode_of_payment: "",
          // investment_date: "",
          // description: "",
          // status: "",
          user_id: defaultUserId,
          // project_id: "",
          // expense_id: "",
          // employee_id: "",
        };

  const [formData, setFormData] = useState(getInitialFormState());
  const [projects, setProjects] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  useEffect(() => {
    setFormData(getInitialFormState());
    // eslint-disable-next-line
  }, [investor, defaultUserId]);

  // useEffect(() => {
  //   if (!open) return;

  //   const fetchProjects = async () => {
  //     setIsLoadingProjects(true);
  //     try {
  //       const list = await projectApi.getAllProjects();
  //       const normalized =
  //         (Array.isArray(list) ? list : list?.data || list?.projects || []).map(
  //           (p) => ({
  //             id: Number(p.project_id ?? p.id ?? p._id),
  //             label: p.name || p.project_name || `Project #${p.id}`, 
  //           })
  //         );
  //       setProjects(normalized);
  //     } catch (err) {
  //       console.error("Failed to load projects:", err);
  //     } finally {
  //       setIsLoadingProjects(false);
  //     }
  //   };

  //   const fetchExpenses = async () => {
  //     setIsLoadingExpenses(true);
  //     try {
  //       const list = await expensesApi.getAllExpenses();
  //       const normalized =
  //         (Array.isArray(list)
  //           ? list
  //           : list?.data || list?.expenses || []
  //         ).map((e) => ({
  //           id: Number(e.expense_id ?? e.id ?? e._id),
  //           label: e.title || e.name || `Expense #${e.id}`,
  //         }));
  //       setExpenses(normalized);
  //     } catch (err) {
  //       console.error("Failed to load expenses:", err);
  //     } finally {
  //       setIsLoadingExpenses(false);
  //     }
  //   };

  //   const fetchEmployees = async () => {
  //     setIsLoadingEmployees(true);
  //     try {
  //       const Employeelist = await employeeApi.getAllEmployees();
  //       const normalized =
  //         (Array.isArray(Employeelist)
  //           ? Employeelist
  //           : Employeelist?.data || Employeelist?.employees || []
  //         ).map((e) => ({
  //           id: Number(e.employee_id ?? e.id ?? e._id),
  //           label: e.name || e.employee_name || `Employee #${e.id}`,
  //         }));
  //       setEmployees(normalized);
  //     } catch (err) {
  //       console.error("Failed to load employees:", err);
  //     } finally {
  //       setIsLoadingEmployees(false);
  //     }
  //   };

  //   fetchEmployees();
  //   fetchProjects();
  //   fetchExpenses();
  // }, [open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // const selectedProjectId = Number(formData.project_id);
    // const selectedExpenseId = Number(formData.expense_id);
    // const selectedEmployeeId = Number(formData.employee_id);

    // if (!selectedProjectId || !selectedExpenseId) {
    //   alert("Please select valid Project and Expense.");
    //   return;
    // }

    const submitData = {
      id: formData.id,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      // invested_amount: Number(formData.invested_amount) || 0,
      // mode_of_payment: formData.mode_of_payment,
      // investment_date: formData.investment_date,
      // description: formData.description.trim(),
      // status: formData.status.toLowerCase(),
      user_id: defaultUserId,
      // project_id: selectedProjectId,
      // expense_id: selectedExpenseId,
      // employee_id: selectedEmployeeId,
    };

    onSave(submitData);
  };

  const handleClose = () => {
    setFormData(getInitialFormState());
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={isOpen => { if (!isOpen) handleClose(); }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{investor ? "Edit Investor" : "Add New Investor"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div className="col-span-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>
            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>
            {/* Phone */}
            <div>
              <Label>Phone</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>
            {/* Amount */}
            {/* <div>
              <Label>Invested Amount</Label>
              <Input
                value={formData.invested_amount}
                onChange={(e) => handleChange("invested_amount", e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div> */}
            {/* Date */}
            {/* <div>
              <Label>Investment Date</Label>
              <Input
                type="date"
                value={formData.investment_date}
                onChange={(e) => handleChange("investment_date", e.target.value)}
                required
              />
            </div> */}
            {/* Status */}
            {/* <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
            {/* Mode of Payment */}
            {/* <div>
              <Label>Mode of Payment</Label>
              <Select
                value={formData.mode_of_payment}
                onValueChange={(value) => handleChange("mode_of_payment", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  {modeOfPaymentOptions.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
            {/* Project */}
            {/* <div>
              <Label>Project</Label>
              <Select
                value={formData.project_id}
                onValueChange={(value) => handleChange("project_id", value)}
                disabled={isLoadingProjects}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
            {/* Employee */}
            {/* <div>
              <Label>Employee</Label>
              <Select
                value={formData.employee_id}
                onValueChange={(value) => handleChange("employee_id", value)}
                disabled={isLoadingEmployees}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>
                      {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
            {/* Expense */}
            {/* <div>
              <Label>Expense</Label>
              <Select
                value={formData.expense_id}
                onValueChange={(value) => handleChange("expense_id", value)}
                disabled={isLoadingExpenses}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select expense" />
                </SelectTrigger>
                <SelectContent>
                  {expenses.map((ex) => (
                    <SelectItem key={ex.id} value={String(ex.id)}>
                      {ex.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
            {/* Description */}
            {/* <div className="col-span-2">
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter description"
              />
            </div> */}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">{investor ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

