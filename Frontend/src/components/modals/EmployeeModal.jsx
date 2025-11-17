
import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export function EmployeeModal({ open, onClose, onSave, employee }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        role: employee.role || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "",
      });
    }
  }, [employee, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic client-side validation aligned with backend constraints
    const trimmed = {
      name: String(formData.name || '').trim(),
      email: String(formData.email || '').trim(),
      phone: String(formData.phone || '').trim(),
      role: String(formData.role || '').trim(),
    };

    if (!trimmed.name) {
      // name is required in backend
      return;
    }

    if (trimmed.phone && !/^\d{10}$/.test(trimmed.phone)) {
      // Phone must be 10 digits if provided
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: trimmed.name,
        email: trimmed.email || null,
        phone: trimmed.phone || null,
        // role is defaulted on backend, avoid sending unexpected values
      };

      if (employee) {
        await onSave({ ...employee, ...payload });
      } else {
        await onSave(payload);
      }
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle>
            {employee ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="10-digit number (optional)"
            />
          </div>

          {/* Role */}
         <div className="space-y-2">
    <Label htmlFor="role">Role</Label>
    <Input
      id="role"
      type="text"
      value="Employee"
      readOnly
      className="cursor-not-allowed bg-gray-100"
      />
    </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-primary hover:shadow-glow"
            >
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
