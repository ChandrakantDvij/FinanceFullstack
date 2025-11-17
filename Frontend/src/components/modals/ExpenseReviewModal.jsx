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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export function ExpenseReviewModal({ open, onClose, onSave, expense }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    expense_id: "",
    reviewer_id: "",
    status: "",
    comment: "",
  });

  useEffect(() => {
    if (expense && open) {
      const expenseId = expense.id ?? expense.expense_id ?? expense.ID ?? expense._id;
      setFormData({
        expense_id: String(expenseId || ""),
        reviewer_id: String(expenseId || ""),
        status: "",
        comment: "",
      });
    }
  }, [expense, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const submitData = {
      expense_id: parseInt(formData.expense_id, 10),
      reviewer_id:parseInt(formData.reviewer_id,10),
      status: formData.status,
      comment: formData.comment?.trim() || "",
    };

    try {
      await onSave(submitData);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!open || !expense) {
    return null;
  }

  return (
    <Dialog modal open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Expense Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-4">
            {/* Expense Info (Read-only) */}
            <div>
              <Label>Expense</Label>
              <div className="mt-1 p-2 bg-muted rounded-md text-sm">
                {expense.title || `Expense #${formData.expense_id}`}
              </div>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                required
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Comments (Optional) */}
            <div>
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Add any comments..."
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

