import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import employeeApi from "@/api/employeeApi";

export function ProjectAssignmentModal({ open, onClose, onSave, project }) {
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  useEffect(() => {
    let isCancelled = false;
    const loadEmployees = async () => {
      if (!open) return;
      setIsLoadingEmployees(true);
      try {
        const list = await employeeApi.getAllEmployees();
        if (isCancelled) return;
        const normalized = (Array.isArray(list) ? list : [])
          .map((e) => ({
            id: Number(e.id ?? e.employee_id ?? e.ID ?? e._id),
            name: String(e.name ?? e.full_name ?? e.employee_name ?? `Employee ${e.id ?? ""}`).trim(),
          }))
          .filter((e) => Number.isFinite(e.id) && e.id > 0);
        setEmployees(normalized);
      } catch (err) {
        if (!isCancelled) console.error("Failed to load employees:", err);
      } finally {
        if (!isCancelled) setIsLoadingEmployees(false);
      }
    };
    loadEmployees();
    return () => {
      isCancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (open && project) {
      setSelectedEmployeeIds([]);
    }
  }, [open, project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedEmployeeIds.length === 0) {
      return;
    }

    setIsLoading(true);

    const submitData = {
      project_id: Number(project.id ?? project.project_id ?? project.ID ?? project._id),
      employee_id: selectedEmployeeIds.map((id) => Number(id)),
    };

    try {
      await onSave(submitData);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEmployee = (employeeId) => {
    setSelectedEmployeeIds((prev) => {
      const idStr = String(employeeId);
      if (prev.includes(idStr)) {
        return prev.filter((id) => id !== idStr);
      } else {
        return [...prev, idStr];
      }
    });
  };

  if (!open || !project) {
    return null;
  }

  return (
    <Dialog modal open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Employees to Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-4">
            {/* Project Info (Read-only) */}
            <div>
              <Label>Project</Label>
              <div className="mt-1 p-2 bg-muted rounded-md text-sm">
                {project.name ?? project.project_name ?? `Project #${project.id ?? ""}`}
              </div>
            </div>

            {/* Employees Multi-Select */}
            <div>
              <Label htmlFor="employees">Select Employees</Label>
              {isLoadingEmployees ? (
                <div className="mt-2 p-4 text-center text-sm text-muted-foreground">
                  Loading employees...
                </div>
              ) : (
                <div className="mt-2 max-h-60 overflow-y-auto border rounded-md p-2 space-y-2">
                  {employees.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-4">
                      No employees available
                    </div>
                  ) : (
                    employees.map((emp) => {
                      const isSelected = selectedEmployeeIds.includes(String(emp.id));
                      return (
                        <div
                          key={emp.id}
                          onClick={() => toggleEmployee(emp.id)}
                          className={`p-2 rounded-md cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleEmployee(emp.id)}
                              className="cursor-pointer"
                            />
                            <span>{emp.name}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || selectedEmployeeIds.length === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign Employees"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

