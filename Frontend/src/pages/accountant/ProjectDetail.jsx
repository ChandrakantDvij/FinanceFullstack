import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, UserPlus, Users, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import projectApi from '@/api/projectApi';
import assignInvestorApi from '@/api/assignInvestorApi';
import projectAssignmentApi from '@/api/projectAssignment';
import investorApi from '@/api/investorApi';
import employeeApi from '@/api/employeeApi';

const normalizeEntity = (entity, fallbackLabel) => {
  if (!entity || typeof entity !== 'object') return fallbackLabel;
  return (
    entity.name ??
    entity.full_name ??
    entity.employee_name ??
    entity.project_name ??
    fallbackLabel
  );
};

const SelectionPill = ({ label, checked, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`flex items-center justify-between w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
      checked
        ? 'border-primary bg-primary/10 text-primary'
        : 'border-border bg-background hover:bg-muted/50'
    }`}
  >
    <span>{label}</span>
    <input
      type="checkbox"
      checked={checked}
      readOnly
      className="pointer-events-none"
    />
  </button>
);

export default function ProjectDetail() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const role = user?.role || 'accountant';
  const rolePathSegment =
    role === 'superadmin' ? 'superadmin' : role === 'reviewer' ? 'reviewer' : 'accountant';
  const canAssign = role === 'accountant';

  const [project, setProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);

  const [investorOptions, setInvestorOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);

  const [assignedInvestors, setAssignedInvestors] = useState([]);
  const [assignedEmployees, setAssignedEmployees] = useState([]);

  const [selectedInvestorIds, setSelectedInvestorIds] = useState([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  const [loadingInvestors, setLoadingInvestors] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [savingInvestors, setSavingInvestors] = useState(false);
  const [savingEmployees, setSavingEmployees] = useState(false);
  const [viewMode, setViewMode] = useState('investors');

  const numericProjectId = useMemo(() => {
    const parsed = Number(projectId);
    return Number.isFinite(parsed) ? parsed : projectId;
  }, [projectId]);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      setLoadingProject(true);
      try {
        const response = await projectApi.getProjectById(projectId);
        const payload =
          response?.data && !Array.isArray(response.data)
            ? response.data
            : response?.project || response;
        setProject(payload || null);
      } catch (error) {
        console.error('Failed to load project', error);
        toast.error(error.message || 'Failed to load project details');
        setProject(null);
      } finally {
        setLoadingProject(false);
      }
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    const loadInvestors = async () => {
      setLoadingInvestors(true);
      try {
        const list = await assignInvestorApi.getAssignInvestorById(projectId);
        setAssignedInvestors(Array.isArray(list) ? list : []);
      } catch (error) {
        if (error?.message?.includes('login')) {
          toast.error(error.message);
        } else {
          console.error('Failed to load assigned investors', error);
        }
        setAssignedInvestors([]);
      } finally {
        setLoadingInvestors(false);
      }
    };

    const loadEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const list = await projectAssignmentApi.getProjectAssignmentById(projectId);
        setAssignedEmployees(Array.isArray(list) ? list : []);
      } catch (error) {
        if (error?.message?.includes('login')) {
          toast.error(error.message);
        } else {
          console.error('Failed to load assigned employees', error);
        }
        setAssignedEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    };

    if (projectId) {
      loadInvestors();
      loadEmployees();
    }
  }, [projectId]);

  useEffect(() => {
    const fetchSelectableLists = async () => {
      try {
        const [investorsResponse, employeesResponse] = await Promise.allSettled([
          investorApi.getAllInvestors(),
          employeeApi.getAllEmployees(),
        ]);

        if (investorsResponse.status === 'fulfilled') {
          const normalizedInvestors = (Array.isArray(investorsResponse.value)
            ? investorsResponse.value
            : []
          )
            .map((inv) => ({
              id: Number(inv.investor_id ?? inv.id ?? inv.ID ?? inv._id),
              name: normalizeEntity(inv, `Investor #${inv?.investor_id ?? inv?.id ?? ''}`),
              email: inv.email ?? '',
              phone: inv.phone ?? inv.contact ?? '',
            }))
            .filter((inv) => Number.isFinite(inv.id) && inv.id > 0);
          setInvestorOptions(normalizedInvestors);
        } else {
          console.error('Failed to load investors', investorsResponse.reason);
        }

        if (employeesResponse.status === 'fulfilled') {
          const normalizedEmployees = (Array.isArray(employeesResponse.value)
            ? employeesResponse.value
            : []
          )
            .map((emp) => ({
              id: Number(emp.employee_id ?? emp.id ?? emp.ID ?? emp._id),
              name: normalizeEntity(emp, `Employee #${emp?.employee_id ?? emp?.id ?? ''}`),
              department: emp.department ?? emp.employee_department ?? '',
            }))
            .filter((emp) => Number.isFinite(emp.id) && emp.id > 0);
          setEmployeeOptions(normalizedEmployees);
        } else {
          console.error('Failed to load employees', employeesResponse.reason);
        }
      } catch (error) {
        console.error('Failed to load selectable options', error);
      }
    };

    if (canAssign) {
      fetchSelectableLists();
    }
  }, [canAssign]);

  const toggleInvestorSelection = (id) => {
    setSelectedInvestorIds((prev) =>
      prev.includes(String(id))
        ? prev.filter((item) => item !== String(id))
        : [...prev, String(id)]
    );
  };

  const toggleEmployeeSelection = (id) => {
    setSelectedEmployeeIds((prev) =>
      prev.includes(String(id))
        ? prev.filter((item) => item !== String(id))
        : [...prev, String(id)]
    );
  };

  const handleAssignInvestors = async (event) => {
    event.preventDefault();
    if (selectedInvestorIds.length === 0) return;

    setSavingInvestors(true);
    try {
      await assignInvestorApi.createAssignInvestor({
        project_id: numericProjectId,
        investor_id: selectedInvestorIds.map((id) => Number(id)),
      });
      toast.success('Investors assigned successfully');
      setSelectedInvestorIds([]);
      const refreshed = await assignInvestorApi.getAssignInvestorById(projectId);
      setAssignedInvestors(Array.isArray(refreshed) ? refreshed : []);
    } catch (error) {
      toast.error(error.message || 'Failed to assign investors');
    } finally {
      setSavingInvestors(false);
    }
  };

  const handleAssignEmployees = async (event) => {
    event.preventDefault();
    if (selectedEmployeeIds.length === 0) return;

    setSavingEmployees(true);
    try {
      await projectAssignmentApi.createProjectAssignment({
        project_id: numericProjectId,
        employee_id: selectedEmployeeIds.map((id) => Number(id)),
      });
      toast.success('Employees assigned successfully');
      setSelectedEmployeeIds([]);
      const refreshed = await projectAssignmentApi.getProjectAssignmentById(projectId);
      setAssignedEmployees(Array.isArray(refreshed) ? refreshed : []);
    } catch (error) {
      toast.error(error.message || 'Failed to assign employees');
    } finally {
      setSavingEmployees(false);
    }
  };

  const renderLoadingState = (label) => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );

  return (
    <div className="flex w-full min-h-screen bg-background">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/${rolePathSegment}/projects`)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {project?.name ?? project?.project_name ?? 'Project Assignments'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage investor and employee assignments for this project
                </p>
              </div>
            </div>
            <div className="w-full sm:w-56">
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investors">Investors</SelectItem>
                  <SelectItem value="employees">Employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {viewMode === 'investors' && (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-primary" />
                      Assigned Investors
                    </CardTitle>
                    <CardDescription>
                      View and assign investors who are funding this project
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{assignedInvestors.length} linked</Badge>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-4 pt-6">
                  {loadingProject && (
                    renderLoadingState('Loading project details…')
                  )}
                  {loadingInvestors ? (
                    renderLoadingState('Loading assigned investors…')
                  ) : assignedInvestors.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No investors assigned to this project yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {assignedInvestors.map((assignment) => {
                        const key =
                          assignment.assign_id ??
                          assignment.id ??
                          `${assignment.project_id}-${assignment.investor_id}`;
                        const investor =
                          assignment.investor ?? assignment.assigned_investor ?? assignment;
                        return (
                          <div
                            key={key}
                            className="rounded-lg border border-border p-3 flex flex-col gap-1"
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-semibold">
                                {normalizeEntity(investor, 'Investor')}
                              </p>
                              {investor?.email && (
                                <Badge variant="secondary">{investor.email}</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              ID: {investor?.investor_id ?? assignment.investor_id ?? 'N/A'}
                              {investor?.phone ? ` • ${investor.phone}` : ''}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {canAssign && (
                    <form className="space-y-4" onSubmit={handleAssignInvestors}>
                      <p className="text-sm font-medium">Assign more investors</p>
                      <div className="max-h-60 overflow-y-auto rounded-lg border p-3 space-y-2">
                        {investorOptions.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-6">
                            No investors available to assign
                          </p>
                        ) : (
                          investorOptions.map((investor) => (
                            <SelectionPill
                              key={investor.id}
                              label={`${investor.name}${investor.email ? ` • ${investor.email}` : ''}`}
                              checked={selectedInvestorIds.includes(String(investor.id))}
                              onToggle={() => toggleInvestorSelection(investor.id)}
                            />
                          ))
                        )}
                      </div>
                      <Button
                        type="submit"
                        disabled={savingInvestors || selectedInvestorIds.length === 0}
                        className="w-full"
                      >
                        {savingInvestors ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Assigning…
                          </>
                        ) : (
                          'Assign Investors'
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
          )}

          {viewMode === 'employees' && (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Assigned Employees
                    </CardTitle>
                    <CardDescription>
                      Team members responsible for executing this project
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{assignedEmployees.length} assigned</Badge>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-4 pt-6">
                  {loadingProject && (
                    renderLoadingState('Loading project details…')
                  )}
                  {loadingEmployees ? (
                    renderLoadingState('Loading assigned employees…')
                  ) : assignedEmployees.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No employees assigned to this project yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {assignedEmployees.map((assignment, index) => {
                        const key =
                          assignment.assignment_id ??
                          assignment.id ??
                          `${assignment.project_id}-${assignment.employee_id}-${index}`;
                        const employee =
                          assignment.employee ?? assignment.assigned_employee ?? assignment;
                        return (
                          <div
                            key={key}
                            className="rounded-lg border border-border p-3 flex flex-col gap-1"
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-semibold">
                                {employee?.name ??
                                  assignment.employee_name ??
                                  normalizeEntity(employee, 'Employee')}
                              </p>
                              <Badge variant="secondary">
                                {assignment.assigner?.name ?? 'Assigned'}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              ID: {employee?.employee_id ?? assignment.employee_id ?? 'N/A'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {canAssign && (
                    <form className="space-y-4" onSubmit={handleAssignEmployees}>
                      <p className="text-sm font-medium">Assign more employees</p>
                      <div className="max-h-60 overflow-y-auto rounded-lg border p-3 space-y-2">
                        {employeeOptions.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-6">
                            No employees available to assign
                          </p>
                        ) : (
                          employeeOptions.map((employee) => (
                            <SelectionPill
                              key={employee.id}
                              label={`${employee.name}${
                                employee.department ? ` • ${employee.department}` : ''
                              }`}
                              checked={selectedEmployeeIds.includes(String(employee.id))}
                              onToggle={() => toggleEmployeeSelection(employee.id)}
                            />
                          ))
                        )}
                      </div>
                      <Button
                        type="submit"
                        disabled={savingEmployees || selectedEmployeeIds.length === 0}
                        className="w-full"
                      >
                        {savingEmployees ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Assigning…
                          </>
                        ) : (
                          'Assign Employees'
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
          )}
        </main>
      </div>
    </div>
  );
}

