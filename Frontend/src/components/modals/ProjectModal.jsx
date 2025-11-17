import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';

const statusOptions = [
   { value: 'planned', label: 'Planned' },
   { value: 'ongoing', label: 'Ongoing' },
   { value: 'completed', label: 'Completed' },
   { value: 'on-hold', label: 'On-Hold' }
];

const departmentOptions = [
  { value: 'IT', label: 'IT' },
  { value: 'HR', label: 'Human Resources' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Operations', label: 'Operations' }
];

export function ProjectModal({ open, onClose, onSave, project = null }) {
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
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    department: '',
    sub_department: '',
    product: '',
    quantity: '',
    description: '',
    estimated_budget: '',
    start_date: '',
    end_date: '',
    status: '',
    created_by: '' // default will be injected from auth
  });

  useEffect(() => {
    if (project) {
      // Format dates for input fields
      const formatted = {
        ...project,
        start_date: project.start_date?.split('T')[0] || '',
        end_date: project.end_date?.split('T')[0] || '',
        estimated_budget: project.estimated_budget?.toString() || '',
        quantity: project.quantity?.toString() || '',
      };
      if (!formatted.created_by) {
        formatted.created_by = defaultCreator;
      }
      setFormData(formatted);
    } else {
      // Reset form for new project
      setFormData({
        name: '',
        location: '',
        department: '',
        sub_department: '',
        product: '',
        quantity: '',
        description: '',
        estimated_budget: '',
        start_date: '',
        end_date: '',
        status: '',
        created_by: ''
      });
    }
  }, [project, defaultCreator]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      quantity: parseInt(formData.quantity, 10) || 0,
      estimated_budget: parseFloat(formData.estimated_budget) || 0
    };
    if (!submitData.created_by) {
      submitData.created_by = defaultCreator;
    }
    // Ensure backend accepts project name under either 'name' or 'project_name'
    if (!submitData.name && submitData.project_name) {
      submitData.name = submitData.project_name;
    }
    // Also ensure status uses compact tokens (no underscores) to avoid DB enum truncation
    if (submitData.status === 'in_progress') submitData.status = 'inprogress';
    if (submitData.status === 'on_hold') submitData.status = 'onhold';

    onSave(submitData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {project ? 'Edit Project' : 'Create New Project'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Project Name */}
            <div className="col-span-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>

            <div>
  <Label>Department</Label>
  <Input
    type="text"
    placeholder="Enter department name"
    value={formData.department}
    onChange={(e) => handleChange('department', e.target.value)}
  />
</div>


            {/* Sub Department */}
            <div>
              <Label htmlFor="sub_department">Sub Department</Label>
              <Input
                id="sub_department"
                value={formData.sub_department}
                onChange={(e) => handleChange('sub_department', e.target.value)}
                placeholder="Enter sub department"
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Enter location"
                required
              />
            </div>

            {/* Status */}
            <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
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

            {/* Product */}
            <div>
              <Label htmlFor="product">Product</Label>
              <Input
                id="product"
                value={formData.product}
                onChange={(e) => handleChange('product', e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                placeholder="Enter quantity"
                min="1"
                required
              />
            </div>

            {/* Budget */}
            <div className="col-span-2">
              <Label htmlFor="estimated_budget">Estimated Budget (₹)</Label>
              <Input
                id="estimated_budget"
                type="number"
                className="no-spinner"
                value={formData.estimated_budget}
                onChange={(e) => handleChange('estimated_budget', e.target.value)}
                placeholder="Enter estimated budget"
                min="0"
                required
              />
            </div>

            {/* Dates */}
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter project description"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {project ? 'Update Project' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}