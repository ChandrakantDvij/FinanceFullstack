import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/dashboard/Navbar';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import dashboardApi from '@/api/dashboardApi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Users, Wallet, TrendingDown, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ProjectAnalytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await dashboardApi.getProjectAnalytics(projectId);
        if (mounted) setData(resp);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [projectId]);

  const expenseChart = (data?.expenses?.details || []).map((d) => ({
    name: d.title,
    amount: Number(d.amount || 0),
  }));

  const investorChart = (data?.investors?.details || []).map((d) => ({
    name: d.name,
    amount: Number(d.invested_amount || 0),
  }));

  // Profit (positive) or Loss (negative) = totalInvestment - totalExpense
  const profit = Number(data?.balance?.totalInvestment || 0) - Number(data?.balance?.totalExpense || 0);

  return (
    <div className="flex w-full min-h-screen bg-background">
      <Sidebar role={user?.role || 'accountant'} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate(-1)} className="hover:translate-x-[-2px] transition-transform">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <h2 className="text-xl font-semibold">Project Analytics</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            data && (
              <div className="space-y-6">
                <Card className="p-6 animate-scale-in">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Project</div>
                      <div className="text-2xl font-bold">{data.project?.name}</div>
                      <div className="text-sm text-muted-foreground">{data.project?.location} • {data.project?.department} / {data.project?.sub_department}</div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatPill icon={Users} label="Employees" value={String(data.employees?.length || 0)} color="text-blue-600" />
                      <StatPill icon={Wallet} label="Budget" value={formatCurrency(data.project?.estimated_budget)} color="text-purple-600" />
                      <StatPill icon={TrendingDown} label="Expenses" value={formatCurrency(data.expenses?.totalExpense)} color="text-rose-600" />
                      <StatPill icon={TrendingUp} label="Investments" value={formatCurrency(data.investors?.totalInvestment)} color="text-emerald-600" />
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6 animate-fade-in-up">
                    <div className="mb-4 font-semibold">Expense Breakdown</div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={expenseChart}>
                          <XAxis dataKey="name" hide />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[6,6,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="p-6 animate-fade-in-up">
                    <div className="mb-4 font-semibold">Investor Contributions</div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={investorChart} dataKey="amount" nameKey="name" outerRadius={100} innerRadius={50} paddingAngle={3}>
                            {investorChart.map((_, i) => (
                              <Cell key={i} fill={`hsl(${(i * 47) % 360} 70% 50%)`} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>

                <Card className="p-6 animate-fade-in-up">
                  <div className="mb-4 font-semibold">Assigned Employees</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(data.employees || []).filter(Boolean).map((emp) => (
                      <div key={emp.employee_id} className="p-4 rounded-lg border bg-card/50 backdrop-blur hover:shadow-glow transition-shadow">
                        <div className="font-medium">{emp.name}</div>
                        <div className="text-sm text-muted-foreground">{emp.email}</div>
                        <div className="text-sm text-muted-foreground">{emp.phone}</div>
                      </div>
                    ))}
                    {(!data.employees || data.employees.filter(Boolean).length === 0) && (
                      <div className="text-muted-foreground">No employees assigned</div>
                    )}
                  </div>
                </Card>

                <Card className="p-6 animate-fade-in-up">
                  <div className="mb-4 font-semibold">Balance</div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <BalanceTile label="Total Investment" value={formatCurrency(data.balance?.totalInvestment)} />
                    <BalanceTile label="Total Expense" value={formatCurrency(data.balance?.totalExpense)} />
                    <BalanceTile label="Profit / Loss" value={formatCurrency(profit)} accent={profit >= 0 ? 'text-emerald-600' : 'text-rose-600'} />
                    <BalanceTile label="Net Balance" value={formatCurrency(data.balance?.netBalance)} accent={data.balance?.netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'} />
                  </div>

                </Card>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}

function StatPill({ icon: Icon, label, value, color }) {
  return (
    <div className={`px-4 py-3 rounded-xl bg-muted/50 border backdrop-blur-sm flex items-center gap-3 transition-all hover:scale-[1.02]`}> 
      <Icon className={`w-5 h-5 ${color}`} />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}

function BalanceTile({ label, value, accent }) {
  return (
    <div className="p-4 rounded-lg border bg-card/50 backdrop-blur">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-xl font-bold ${accent || ''}`}>{value}</div>
    </div>
  );
}

function formatCurrency(value) {
  const num = Number(value || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}


