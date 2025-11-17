

// import { useEffect, useMemo, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Loader2 } from "lucide-react";
// import projectApi from "@/api/projectApi";
// import expensesApi from "@/api/expensesApi";
// import employeeApi from "@/api/employeeApi"; // Add this line!
// import { useAuth } from "@/contexts/AuthContext";
// const expenseTypes = [
//   { value: "advance", label: "Advance" },
//   { value: "recurring", label: "recurring" },
// ];

// const modeOfPaymentTypes = [
//   { value: "cash", label: "Cash" },
//   { value: "bank_transfer", label: "Bank Transfer" },
//   { value: "upi", label: "UPI" },
//   { value: "cheque", label: "Cheque" },
//   { value: "other", label: "Other" }
// ];

// export function ExpenseModal({ open, onClose, onSave, expense }) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [projects, setProjects] = useState([]);
//   const [isLoadingProjects, setIsLoadingProjects] = useState(false);
//   const [projectsError, setProjectsError] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
//   const [employeesError, setEmployeesError] = useState("");

//   const { user } = useAuth();
//   const defaultCreator = useMemo(() => {
//     return (
//       user?.id?.toString?.() ||
//       user?.user_id?.toString?.() ||
//       user?.email ||
//       user?.name ||
//       'system'
//     );
//   }, [user]);

//   const [formData, setFormData] = useState({
//     project_id: "",
//     expense_type: "",
//     title: "",
//     description: "",
//     amount: "",
//     expense_date: "",
//     mode_of_payment: "",
//     created_by: "",
//     employee_id: "", // Add employee field
//   });

//   useEffect(() => {
//     let isCancelled = false;
//     const loadProjects = async () => {
//       if (!open) return;
//       setIsLoadingProjects(true);
//       setProjectsError("");
//       try {
//         const list = await projectApi.getAllProjects();
//         if (isCancelled) return;
//         const normalized = (Array.isArray(list) ? list : list?.data || list?.projects || [])
//           .map((p) => ({
//             id: Number(p.project_id ?? p.id ?? p.ID ?? p._id),
//             label:
//               [p.name, p.project_name, p.title]
//                 .filter(Boolean)
//                 .map((v) => String(v))
//                 .find(Boolean) || `Project ${p.project_id ?? p.id ?? ""}`,
//           }))
//           .filter((p) => Number.isFinite(p.id) && p.id > 0);
//         setProjects(normalized);
//       } catch (err) {
//         if (!isCancelled) setProjectsError(err?.message || "Failed to load projects");
//       } finally {
//         if (!isCancelled) setIsLoadingProjects(false);
//       }
//     };
//     loadProjects();
//     return () => {
//       isCancelled = true;
//     };
//   }, [open]);

//   // -- LOAD EMPLOYEES --
//   useEffect(() => {
//     let isCancelled = false;
//     const loadEmployees = async () => {
//       if (!open) return;
//       setIsLoadingEmployees(true);
//       setEmployeesError("");
//       try {
//         const list = await employeeApi.getAllEmployees();
//         if (isCancelled) return;
//         const normalized = (Array.isArray(list) ? list : list?.data || list?.employees || [])
//           .map((emp) => ({
//             id: Number(emp.employee_id ?? emp.id ?? emp.ID ?? emp._id),
//             label:
//               [emp.name, emp.employee_name, emp.title]
//                 .filter(Boolean)
//                 .map((v) => String(v))
//                 .find(Boolean) || `Employee ${emp.employee_id ?? emp.id ?? ""}`,
//           }))
//           .filter((e) => Number.isFinite(e.id) && e.id > 0);
//         setEmployees(normalized);
//       } catch (err) {
//         if (!isCancelled) setEmployeesError(err?.message || "Failed to load employees");
//       } finally {
//         if (!isCancelled) setIsLoadingEmployees(false);
//       }
//     };
//     loadEmployees();
//     return () => {
//       isCancelled = true;
//     };
//   }, [open]);
//   // ---------------------

//   useEffect(() => {
//     if (expense) {
//       setFormData({
//         project_id: expense.project_id?.toString() || "",
//         expense_type: expense.expense_type || "",
//         title: expense.title || "",
//         description: expense.description || "",
//         amount: expense.amount?.toString() || "",
//         expense_date: expense.expense_date?.split("T")[0] || "",
//         mode_of_payment: expense.mode_of_payment || "",
//         created_by: expense.created_by?.toString() || defaultCreator,
//         employee_id: expense.employee_id?.toString() || "", // initialize employee field
//       });
//     } else {
//       setFormData({
//         project_id: "",
//         expense_type: "",
//         title: "",
//         description: "",
//         amount: "",
//         expense_date: "",
//         mode_of_payment: "",
//         created_by: defaultCreator,
//         employee_id: "",
//       });
//     }
//   }, [expense, defaultCreator]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     const creatorRaw = formData.created_by || defaultCreator;
//     const creatorNumeric = parseInt(creatorRaw, 10);
//     const submitData = {
//       project_id: parseInt(formData.project_id, 10),
//       expense_type: formData.expense_type,
//       title: formData.title,
//       description: formData.description,
//       amount: parseFloat(formData.amount),
//       expense_date: formData.expense_date,
//       mode_of_payment: formData.mode_of_payment,
//       created_by: Number.isNaN(creatorNumeric) ? creatorRaw : creatorNumeric,
//       employee_id: parseInt(formData.employee_id, 10), // add this to submit data
//     };
//     try {
//       if (expense) {
//         await onSave({ ...expense, ...submitData });
//       } else {
//         await onSave(submitData);
//       }
//       onClose();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//  return (
//     <Dialog modal open={open} onOpenChange={onClose}>
//       {/* Widen the form: Change max-w-md to max-w-lg */}
//       <DialogContent className="max-w-lg">
//         <DialogHeader>
//           <DialogTitle>
//             {expense ? "Edit Expense" : "Add New Expense"}
//           </DialogTitle>
//         </DialogHeader>
//         {/* Reduce padding and vertical spacing: py-2, space-y-3 */}
//         <form onSubmit={handleSubmit} className="space-y-3 py-2">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//             {/* Project Selection (unchanged) */}
//             <div>
//               <Label htmlFor="project_id">Project</Label>
//               <Select
//                 value={formData.project_id}
//                 onValueChange={(value) => setFormData({ ...formData, project_id: value })}
//                 disabled={isLoadingProjects || !!projectsError}
//                 required
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder={isLoadingProjects ? "Loading..." : projectsError ? "Error loading projects" : "Select project"} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {projects.map((p) => (
//                     <SelectItem key={p.id} value={String(p.id)}>
//                       {p.label} (#{p.id})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Employee Selection */}
//             <div>
//               <Label htmlFor="employee_id">Employee</Label>
//               <Select
//                 value={formData.employee_id}
//                 onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
//                 disabled={isLoadingEmployees || !!employeesError}
//                 required
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder={isLoadingEmployees ? "Loading..." : employeesError ? "Error loading employees" : "Select employee"} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {employees.map((e) => (
//                     <SelectItem key={e.id} value={String(e.id)}>
//                       {e.label} (#{e.id})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Expense Type (unchanged) */}
//             <div>
//               <Label htmlFor="expense_type">Expense Type</Label>
//               <Select
//                 value={formData.expense_type}
//                 onValueChange={(value) => setFormData({ ...formData, expense_type: value })}
//                 required
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Choose expense type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {expenseTypes.map((type) => (
//                     <SelectItem key={type.value} value={type.value}>
//                       {type.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Mode of Payment (unchanged) */}
//             <div>
//               <Label htmlFor="mode_of_payment">Payment Mode</Label>
//               <Select
//                 value={formData.mode_of_payment}
//                 onValueChange={(value) => setFormData({ ...formData, mode_of_payment: value })}
//                 required
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Choose payment mode" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {modeOfPaymentTypes.map((type) => (
//                     <SelectItem key={type.value} value={type.value}>
//                       {type.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Expense Date */}
//             <div>
//               <Label htmlFor="expense_date">Expense Date</Label>
//               <Input
//                 id="expense_date"
//                 type="date"
//                 value={formData.expense_date}
//                 onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
//                 required
//                 placeholder="Choose date"
//               />
//             </div>

//             {/* Title */}
//             <div>
//               <Label htmlFor="title">Title</Label>
//               <Input
//                 id="title"
//                 value={formData.title}
//                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                 required
//                 placeholder="Expense title"
//               />
//             </div>

//             {/* Amount */}
//             <div>
//               <Label htmlFor="amount">Amount (₹)</Label>
//               <Input
//                 id="amount"
//                 type="number"
//                 className="no-spinner"
//                 min="0"
//                 value={formData.amount}
//                 onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//                 required
//                 placeholder="Enter amount"
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 required
//                 placeholder="Enter description"
//               />
//             </div>
//           </div>
         



//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? (
//                 <>
//                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 "Save"
//               )}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

import { useEffect, useMemo, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import projectApi from "@/api/projectApi";
import expensesApi from "@/api/expensesApi";
// import employeeApi from "@/api/employeeApi";
import projectAssignmentApi from "@/api/projectAssignment";
import { useAuth } from "@/contexts/AuthContext";

const expenseTypes = [
  { value: "advance", label: "Advance" },
  { value: "recurring", label: "recurring" },
];

const modeOfPaymentTypes = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "upi", label: "UPI" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" }
];

export function ExpenseModal({ open, onClose, onSave, expense }) {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [projectsError, setProjectsError] = useState("");
  // const [employees, setEmployees] = useState([]);
  const [projectAssignments ,setProjectAssignments] =useState([]);
  const [isLoadingProjectAssignements, setIsLoadingProjectAssignments]= useState(false);
  // const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
 const [projectAssignmentsError, setProjectAssignmentsError] =useState(false);

  const { user } = useAuth();
  const defaultCreator = useMemo(() => {
    return (
      user?.id?.toString?.() ||
      user?.user_id?.toString?.() ||
      user?.email ||
      user?.name ||
      'system'
    );
  }, [user]);

  // Store initial form values
  const getInitialFormState = () => expense ? {
    project_id: expense.project_id?.toString() || "",
    expense_type: expense.expense_type || "",
    title: expense.title || "",
    description: expense.description || "",
    amount: expense.amount?.toString() || "",
    expense_date: expense.expense_date?.split("T")[0] || "",
    mode_of_payment: expense.mode_of_payment || "",
    created_by: expense.created_by?.toString() || defaultCreator,
    employee_id: expense.employee_id?.toString() || "",
  } : {
    project_id: "",
    expense_type: "",
    title: "",
    description: "",
    amount: "",
    expense_date: "",
    mode_of_payment: "",
    created_by: defaultCreator,
    employee_id: "",
  };

  const [formData, setFormData] = useState(getInitialFormState);
  const previousProjectIdRef = useRef(null);

  // Keep initial state updated if expense/defaultCreator changes
  useEffect(() => {
    const newFormData = getInitialFormState();
    setFormData(newFormData);
    // Reset employee_id when project changes or modal opens/closes
    if (!newFormData.project_id) {
      setProjectAssignments([]);
    }
    // Track the initial project_id
    previousProjectIdRef.current = newFormData.project_id;
    // eslint-disable-next-line
  }, [expense, defaultCreator]);

  // Reset employee selection when project changes (but not on initial load)
  useEffect(() => {
    const currentProjectId = formData.project_id;
    const previousProjectId = previousProjectIdRef.current;
    
    // Only clear employee if project actually changed (not on initial load)
    if (currentProjectId && previousProjectId !== null && previousProjectId !== currentProjectId) {
      setFormData((prev) => ({ ...prev, employee_id: "" }));
    }
    
    // Update the ref to track current project_id
    previousProjectIdRef.current = currentProjectId;
  }, [formData.project_id]);

  useEffect(() => {
    let isCancelled = false;
    const loadProjects = async () => {
      if (!open) return;
      setIsLoadingProjects(true);
      setProjectsError("");
      try {
        const list = await projectApi.getAllProjects();
        if (isCancelled) return;
        const normalized = (Array.isArray(list) ? list : list?.data || list?.projects || [])
          .map((p) => ({
            id: Number(p.project_id ?? p.id ?? p.ID ?? p._id),
            label:
              [p.name, p.project_name, p.title]
                .filter(Boolean)
                .map((v) => String(v))
                .find(Boolean) || `Project ${p.project_id ?? p.id ?? ""}`,
          }))
          .filter((p) => Number.isFinite(p.id) && p.id > 0);
        setProjects(normalized);
      } catch (err) {
        if (!isCancelled) setProjectsError(err?.message || "Failed to load projects");
      } finally {
        if (!isCancelled) setIsLoadingProjects(false);
      }
    };
    loadProjects();
    return () => {
      isCancelled = true;
    };
  }, [open]);

  // Load employees when project is selected
  useEffect(() => {
    let isCancelled = false;
    const loadProjectAssignments = async () => {
      // Don't load if modal is not open
      if (!open) return;
      
      // Reset employees when no project is selected
      if (!formData.project_id) {
        setProjectAssignments([]);
        setProjectAssignmentsError("");
        return;
      }

      setIsLoadingProjectAssignments(true);
      setProjectAssignmentsError("");
      try {
        // API method already extracts the data array from response
        const list = await projectAssignmentApi.getProjectAssignmentById(formData.project_id);
        if (isCancelled) return;
        
        // Ensure we have an array
        const assignmentsArray = Array.isArray(list) ? list : [];
        
        // Filter to only include entries with employee_id and employee_name
        // Map to normalized format
        const normalized = assignmentsArray
          .filter((item) => item.employee_id && item.employee_name) // Only include entries with employee data
          .map((item) => ({
            id: Number(item.employee_id),
            label: String(item.employee_name || `Employee ${item.employee_id}`),
          }))
          .filter((e) => Number.isFinite(e.id) && e.id > 0);
        
        setProjectAssignments(normalized);
      } catch (err) {
        if (!isCancelled) {
          setProjectAssignmentsError(err?.message || "Failed to load employees");
          setProjectAssignments([]);
        }
      } finally {
        if (!isCancelled) setIsLoadingProjectAssignments(false);
      }
    };
    
    loadProjectAssignments();
    return () => {
      isCancelled = true;
    };
  }, [formData.project_id, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const creatorRaw = formData.created_by || defaultCreator;
    const creatorNumeric = parseInt(creatorRaw, 10);
    const submitData = {
      project_id: parseInt(formData.project_id, 10),
      expense_type: formData.expense_type,
      title: formData.title,
      description: formData.description,
      amount: parseFloat(formData.amount),
      expense_date: formData.expense_date,
      mode_of_payment: formData.mode_of_payment,
      created_by: Number.isNaN(creatorNumeric) ? creatorRaw : creatorNumeric,
      employee_id: parseInt(formData.employee_id, 10),
    };
    try {
      if (expense) {
        await onSave({ ...expense, ...submitData });
      } else {
        await onSave(submitData);
      }
      handleClose();
    } finally {
      setIsLoading(false);
    }
  };

  // ADD THIS FUNCTION to reset form data when the dialog is closed
  const handleClose = () => {
    setFormData(getInitialFormState());
    onClose();
  };

  return (
    <Dialog modal open={open} onOpenChange={isOpen => {
      if (!isOpen) handleClose();
    }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {expense ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project_id">Project</Label>
              <Select
                value={formData.project_id}
                onValueChange={(value) => setFormData({ ...formData, project_id: value })}
                disabled={isLoadingProjects || !!projectsError}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingProjects ? "Loading..." : projectsError ? "Error loading projects" : "Select project"} />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.label} (#{p.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="employee_id">Employee</Label>
              <Select
                value={formData.employee_id}
                onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
                disabled={!formData.project_id || isLoadingProjectAssignements || !!projectAssignmentsError}
                required
              >
                <SelectTrigger>
                  <SelectValue 
                    placeholder={
                      !formData.project_id 
                        ? "Select project first" 
                        : isLoadingProjectAssignements 
                        ? "Loading..." 
                        : projectAssignmentsError 
                        ? "Error loading employees" 
                        : projectAssignments.length === 0
                        ? "No employees assigned"
                        : "Select employee"
                    } 
                  />
                </SelectTrigger>
                <SelectContent>
                  {projectAssignments.map((emp) => (
                    <SelectItem key={emp.id} value={String(emp.id)}>
                      {emp.label} (#{emp.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expense_type">Expense Type</Label>
              <Select
                value={formData.expense_type}
                onValueChange={(value) => setFormData({ ...formData, expense_type: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose expense type" />
                </SelectTrigger>
                <SelectContent>
                  {expenseTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mode_of_payment">Payment Mode</Label>
              <Select
                value={formData.mode_of_payment}
                onValueChange={(value) => setFormData({ ...formData, mode_of_payment: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose payment mode" />
                </SelectTrigger>
                <SelectContent>
                  {modeOfPaymentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expense_date">Expense Date</Label>
              <Input
                id="expense_date"
                type="date"
                value={formData.expense_date}
                onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                required
                placeholder="Choose date"
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Expense title"
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                className="no-spinner"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                placeholder="Enter amount"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Enter description"
              />
            </div>
          </div>
          <DialogFooter>
            {/* Use handleClose for cancel! */}
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
