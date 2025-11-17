// import { useEffect, useState } from 'react';
// import { Navbar } from '@/components/dashboard/Navbar';
// import { Sidebar } from '@/components/dashboard/Sidebar';
// import { StatsCard } from '@/components/dashboard/StatsCard';
// import { Users, FolderKanban, TrendingUp, DollarSign } from 'lucide-react';
// import dashboardApi from '@/api/dashboardApi'

// import { Card } from '@/components/ui/card';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadialBarChart,PolarAngleAxis, RadialBar } from 'recharts';

// export default function ReviewerDashboard() {
//   const [stats, setStats] = useState({
//     employees: 0,
//     projects: 0,
//     investors: 0,
//     totalExpenses: 0,
//   });
//   const [projectsOverview, setProjectsOverview] = useState([]);
//   const [barData, setBarData] = useState([]); // per-project Investment vs Expense
//   const [pieData, setPieData] = useState([]); // Expense share per project
//   const [lineData, setLineData] = useState([]); // Net balance per project
//   const [budgetData, setBudgetData] = useState([]); // Budget per project
//   const [empExpData, setEmpExpData] = useState([]); // Employees vs Expenses count
//   const [statusData, setStatusData] = useState([]); // Status distribution pie
//   const [selectedProjectIdx, setSelectedProjectIdx] = useState(0); // for circle chart selector

//   const formatCurrency = (num) => {
//     const n = Number(num || 0);
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 2,
//     }).format(n);
//   };

//   const formatDate = (d) => {
//     if (!d) return '';
//     return new Date(d).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' });
//   };

//   useEffect(() => {
//     loadStats();
//   }, []);

 

//   const loadStats = async () => {
//     try {
//       const overview = await dashboardApi.getOverview();
//       const all = await dashboardApi.getAllProjectsOverview();
//       setStats({
//         employees: overview.totalEmployees,
//         projects: overview.totalProjects,
//         investors: overview.totalInvestors,
//         totalExpenses: overview.totalExpenses,
//       });
//       setProjectsOverview(all);
//       const bars = all.map((p) => ({
//         name: p?.project?.name || `Project ${p?.project?.project_id ?? ''}`,
//         investment: Number(p?.investors?.totalInvestment ?? 0),
//         expense: Number(p?.expenses?.totalExpense ?? 0),
//       }));
//       const pies = all.map((p) => ({
//         name: p?.project?.name || `Project ${p?.project?.project_id ?? ''}`,
//         value: Number(p?.expenses?.totalExpense ?? 0),
//       })).filter((d) => d.value > 0);
//       const lines = all.map((p, idx) => ({
//         name: p?.project?.name || `P${idx + 1}`,
//         net: Number(p?.balance?.netBalance ?? 0),
//       }));
//       // Process budget data (use estimated_budget if present, fallback to budget)
//       const budgets = all.map((p) => ({
//         name: p?.project?.name || `Project ${p?.project?.project_id ?? ''}`,
//         budget: Number(p?.project?.estimated_budget ?? p?.project?.budget ?? 0)
//       }));
      
//       const empExp = all.map((p) => ({
//         name: p?.project?.name || `Project ${p?.project?.project_id ?? ''}`,
//         employees: Number(p?.employees?.length ?? 0),
//         expensesCount: Number(p?.expenses?.expenseCount ?? 0),
//       }));

//       // Status distribution
//       const statuses = all.reduce((acc, p) => {
//         const status = p?.project?.status || 'Unknown';
//         acc[status] = (acc[status] || 0) + 1;
//         return acc;
//       }, {});
//       const statusDistribution = Object.entries(statuses).map(([name, value]) => ({ name, value }));

//       setBarData(bars);
//       setBudgetData(budgets);
//       setPieData(pies);
//       setEmpExpData(empExp);
//       setLineData(lines);
//       setStatusData(statusDistribution);
//     } catch (error) {
//       // Fallback to zeros if overview fails
//       setStats({ employees: 0, projects: 0, investors: 0, totalExpenses: 0 });
//       setProjectsOverview([]);
//       setEmpExpData([]);
//       setBudgetData([]);
//       setBarData([]);
//       setPieData([]);
//       setLineData([]);
//     }
//   };


  
//   const barColors = { investment: 'hsl(var(--success))', expense: 'hsl(var(--destructive))' };
//   const pieColors = ['#6366F1', '#06B6D4', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#14B8A6'];

//   return (
//     <div className="flex w-full min-h-screen bg-background">
//       <Sidebar role="reviewer" />
//       <div className="flex-1 flex flex-col">
//         <Navbar />
//         <main className="flex-1 p-6 space-y-6 animate-fade-in">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <StatsCard
//               title="Total Employees"
//               value={stats.employees}
//               icon={Users}
//               trend={{ value: 12, isPositive: true }}
//               gradient="secondary"
//             />
//             <StatsCard
//               title="Active Projects"
//               value={stats.projects}
//               icon={FolderKanban}
//               trend={{ value: 8, isPositive: true }}
//               gradient="primary"
//             />
//             <StatsCard
//               title="Total Investors"
//               value={stats.investors}
//               icon={TrendingUp}
//               trend={{ value: 5, isPositive: true }}
//               gradient="success"
//             />
//             <StatsCard
//               title="Total Expenses"
//               value={stats.totalExpenses}
//               icon={DollarSign}
//               trend={{ value: 3, isPositive: false }}
//               gradient="warning"
//             />
//           </div>

         

// <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card className="p-6 animate-fade-in-up backdrop-blur-sm bg-card/50 border-border/50">
//               <h3 className="text-lg font-semibold mb-4">Earning</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={barData}>
//                   <defs>
//                     <linearGradient id="grad-expense" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#ff6bcb" />
//                       <stop offset="100%" stopColor="#7a3cff" />
//                     </linearGradient>
//                     <linearGradient id="grad-invest" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#00e7f0" />
//                       <stop offset="100%" stopColor="#2dd4bf" />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
//                   <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={70} />
//                   <YAxis />
//                   <Tooltip 
//                     contentStyle={{ 
//                       backgroundColor: 'hsl(var(--card))',
//                       border: '1px solid hsl(var(--border))',
//                       borderRadius: '8px'
//                     }}
//                   />
//                   <Bar dataKey="expense" name="Total Expense" fill={barColors.expense} radius={[8, 8, 0, 0]} />
//                   <Bar dataKey="investment" name="Investment" fill={barColors.investment} radius={[8, 8, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </Card>
//             <Card className="p-6 animate-fade-in-up backdrop-blur-sm bg-card/50 border-border/50">
//               <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={pieData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={70}
//                     outerRadius={110}
//                     paddingAngle={3}
//                     dataKey="value"
//                     nameKey="name"
//                     stroke="transparent"
//                   >
//                     {pieData.map((_, index) => (
//                       <Cell key={`exp-cell-${index}`} fill={pieColors[index % pieColors.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     formatter={(val, n, entry) => [formatCurrency(val), entry?.name]}
//                     contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//               <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
//                 {pieData.map((item, idx) => (
//                   <div key={item.name + idx} className="flex items-center justify-between rounded-md border border-border/50 bg-muted/10 px-3 py-2">
//                     <div className="flex items-center gap-2 min-w-0">
//                       <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[idx % pieColors.length] }} />
//                       <span className="text-sm truncate">{item.name}</span>
//                     </div>
//                     <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
//                   </div>
//                 ))}
//                 {pieData.length === 0 && (
//                   <div className="text-sm text-muted-foreground">No expense data.</div>
//                 )}
//               </div>
//             </Card>
//           </div>

          
          

// <Card className="p-6 animate-fade-in-up backdrop-blur-sm bg-card/50 border-border/50">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold">Project Circle Insights</h3>
//               <select
//                 className="bg-background border border-border/60 rounded-md px-3 py-1 text-sm"
//                 value={selectedProjectIdx}
//                 onChange={(e) => setSelectedProjectIdx(Number(e.target.value))}
//               >
//                 {projectsOverview.map((p, idx) => (
//                   <option key={(p?.project?.project_id ?? idx) + ''} value={idx}>
//                     {p?.project?.name || `Project ${p?.project?.project_id ?? idx + 1}`}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="relative">
//                 <ResponsiveContainer width="100%" height={320}>
//                   {/* Compute normalized percentages for employees and expenses relative to max across projects */}
//                   {
//                     (() => {
//                       const sel = projectsOverview[selectedProjectIdx] || {};
//                       const name = sel?.project?.name || '';
//                       const employees = Number(sel?.employees?.length || 0);
//                       const expensesCount = Number(sel?.expenses?.expenseCount || 0);
//                       const status = String(sel?.project?.status || '').toLowerCase();
//                       const completion = status === 'completed' || status === 'complete' || status === 'done' ? 100 : status === 'in progress' || status === 'progress' ? 60 : status === 'started' ? 30 : 0;
//                       const maxEmp = Math.max(1, ...empExpData.map((d) => Number(d?.employees || 0)));
//                       const maxExp = Math.max(1, ...empExpData.map((d) => Number(d?.expensesCount || 0)));
//                       const empPct = Math.min(100, Math.round((employees / maxEmp) * 100));
//                       const expPct = Math.min(100, Math.round((expensesCount / maxExp) * 100));
//                       const data = [
//                         { name: 'Employees', value: empPct, fill: 'url(#rad-grad-emp)' },
//                         { name: 'Expenses', value: expPct, fill: 'url(#rad-grad-exp)' },
//                         { name: 'Completion', value: completion, fill: 'url(#rad-grad-comp)' },
//                       ];
//                       return (
//                         <RadialBarChart innerRadius="25%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
//                           <defs>
//                             <linearGradient id="rad-grad-emp" x1="0" y1="0" x2="1" y2="1">
//                               <stop offset="0%" stopColor="#22d3ee" />
//                               <stop offset="100%" stopColor="#3b82f6" />
//                             </linearGradient>
//                             <linearGradient id="rad-grad-exp" x1="0" y1="0" x2="1" y2="1">
//                               <stop offset="0%" stopColor="#fb923c" />
//                               <stop offset="100%" stopColor="#f472b6" />
//                             </linearGradient>
//                             <linearGradient id="rad-grad-comp" x1="0" y1="0" x2="1" y2="1">
//                               <stop offset="0%" stopColor="#34d399" />
//                               <stop offset="100%" stopColor="#8b5cf6" />
//                             </linearGradient>
//                             <filter id="rad-glow" x="-50%" y="-50%" width="200%" height="200%">
//                               <feGaussianBlur stdDeviation="2" result="blur" />
//                               <feMerge>
//                                 <feMergeNode in="blur" />
//                                 <feMergeNode in="SourceGraphic" />
//                               </feMerge>
//                             </filter>
//                           </defs>
//                           <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
//                           <RadialBar dataKey="value" cornerRadius={8} background clockWise label={false} filter="url(#rad-glow)" />
//                           {/* Center label overlay */}
//                         </RadialBarChart>
//                       );
//                     })()
//                   }
//                 </ResponsiveContainer>
                
//               </div>
//               <div className="space-y-3">
//                 {(() => {
//                   const sel = projectsOverview[selectedProjectIdx] || {};
//                   const status = String(sel?.project?.status || '').toLowerCase();
//                   const isComplete = status === 'completed' || status === 'complete' || status === 'done';
//                   const start = sel?.project?.start_date || sel?.project?.startDate;
//                   const end = sel?.project?.end_date || sel?.project?.endDate;
//                   const rows = [
//                     { label: 'Employees', value: String(sel?.employees?.length || 0), color: 'bg-cyan-400' },
//                     { label: 'Expenses', value: String(sel?.expenses?.expenseCount || 0), color: 'bg-orange-400' },
//                     { label: 'Status', value: isComplete ? 'Completed' : (status ? status : 'Unknown'), color: isComplete ? 'bg-emerald-400' : 'bg-fuchsia-400' },
//                     { label: 'Start', value: formatDate(start) || '—', color: 'bg-indigo-400' },
//                     { label: 'End', value: formatDate(end) || 'TBD', color: 'bg-purple-400' },
//                   ];
//                   return rows.map((r, i) => (
//                     <div key={r.label + i} className="flex items-center justify-between rounded-md border border-border/50 bg-muted/10 p-3">
//                       <div className="flex items-center gap-2 min-w-0">
//                         <span className={`w-2.5 h-2.5 rounded-full ${r.color}`}></span>
//                         <span className="text-sm text-muted-foreground">{r.label}</span>
//                       </div>
//                       <span className="text-sm font-medium truncate max-w-[60%] text-right">{r.value}</span>
//                     </div>
//                   ));
//                 })()}
//               </div>
//             </div>
//           </Card>

//          <Card className="p-6 animate-fade-in-up backdrop-blur-sm bg-card/50 border-border/50">
//             <h3 className="text-lg font-semibold mb-4">Net Balance</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={lineData}>
//                 <defs>
//                   <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
//                     <stop offset="0%" stopColor="#22d3ee" />
//                     <stop offset="50%" stopColor="#a78bfa" />
//                     <stop offset="100%" stopColor="#f472b6" />
//                   </linearGradient>
//                   <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.35" />
//                     <stop offset="100%" stopColor="#111827" stopOpacity="0" />
//                   </linearGradient>
//                   <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
//                     <feGaussianBlur stdDeviation="3" result="coloredBlur" />
//                     <feMerge>
//                       <feMergeNode in="coloredBlur" />
//                       <feMergeNode in="SourceGraphic" />
//                     </feMerge>
//                   </filter>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
//                 <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
//                 <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
//                 <Tooltip 
//                   contentStyle={{ 
//                     backgroundColor: 'hsl(var(--card))',
//                     border: '1px solid hsl(var(--border))',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 {/* translucent area for neon vibe */}
//                 <Line
//                   type="monotone"
//                   dataKey="net"
//                   stroke="url(#line-grad)"
//                   strokeWidth={3}
//                   dot={{ r: 6, fill: '#a78bfa', stroke: '#22d3ee', strokeWidth: 2, filter: 'url(#glow)' }}
//                   activeDot={{ r: 7 }}
//                 />
//              </LineChart>
//             </ResponsiveContainer>
//            </Card>
//            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card className="p-6 animate-fade-in-up backdrop-blur-sm bg-card/50 border-border/50">
//               <h3 className="text-lg font-semibold mb-4">Budget Chart</h3>
//               <ResponsiveContainer width="100%" height={280}>
//                 <BarChart data={budgetData}>
//                   <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
//                   <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={70} />
//                   <YAxis />
//                   <Tooltip />
//                   <defs>
//                     <linearGradient id="grad-primary" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#a78bfa" />
//                       <stop offset="100%" stopColor="#4f46e5" />
//                     </linearGradient>
//                   </defs>
//                   <Bar dataKey="budget" name="Budget" fill="url(#grad-primary)" radius={[8,8,0,0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </Card>

//              <Card className="p-6 animate-fade-in-up backdrop-blur-sm bg-card/50 border-border/50">
//               <h3 className="text-lg font-semibold mb-4">Profit/Loss Overview</h3>
//               <ResponsiveContainer width="100%" height={280}>
//                 <BarChart data={projectsOverview.map(p => ({
//                   name: p?.project?.name || `Project ${p?.project?.project_id ?? ''}`,
//                   profit: p?.balance?.profitOrLoss === 'Profit' ? Number(p?.balance?.netBalance || 0) : 0,
//                   loss: p?.balance?.profitOrLoss === 'Loss' ? Math.abs(Number(p?.balance?.netBalance || 0)) : 0
//                 }))}>
//                   <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
//                   <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={70} />
//                   <YAxis tickFormatter={(value) => new Intl.NumberFormat('en-IN', {
//                     style: 'currency',
//                     currency: 'INR',
//                     notation: 'compact',
//                     maximumFractionDigits: 1
//                   }).format(value)} />
//                   <Tooltip 
//                     formatter={(value) => [new Intl.NumberFormat('en-IN', {
//                       style: 'currency',
//                       currency: 'INR',
//                       maximumFractionDigits: 0
//                     }).format(value), value > 0 ? 'Profit' : 'Loss']}
//                     contentStyle={{ 
//                       backgroundColor: 'hsl(var(--card))',
//                       border: '1px solid hsl(var(--border))',
//                       borderRadius: '8px'
//                     }}
//                   />
//                   <defs>
//                     <linearGradient id="profit-gradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#34d399" />
//                       <stop offset="100%" stopColor="#10b981" />
//                     </linearGradient>
//                     <linearGradient id="loss-gradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#f87171" />
//                       <stop offset="100%" stopColor="#ef4444" />
//                     </linearGradient>
//                   </defs>
//                   <Bar dataKey="profit" name="Profit" fill="url(#profit-gradient)" radius={[8,8,0,0]} />
//                   <Bar dataKey="loss" name="Loss" fill="url(#loss-gradient)" radius={[8,8,0,0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </Card>

            
//           </div>
         
//         </main>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Users, FolderKanban, TrendingUp, DollarSign } from 'lucide-react';
import dashboardApi from '@/api/dashboardApi';

import { Card } from '@/components/ui/card';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, PolarAngleAxis, RadialBar
} from 'recharts';

export default function ReviewerDashboard() {
  const [stats, setStats] = useState({
    employees: 0,
    projects: 0,
    investors: 0,
    totalExpenses: 0,
  });
  const [projectsOverview, setProjectsOverview] = useState([]);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [empExpData, setEmpExpData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [selectedProjectIdx, setSelectedProjectIdx] = useState(-1); // -1 = All Projects, >=0 = specific project

  const formatCurrency = (num) => {
    const n = Number(num || 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(n);
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    // Filter data for all or selected project
    if (!projectsOverview || projectsOverview.length === 0) {
      setBarData([]);
      setPieData([]);
      setLineData([]);
      setBudgetData([]);
      setEmpExpData([]);
      setStatusData([]);
      return;
    }
    let filtered = projectsOverview;
    if (selectedProjectIdx > -1) {
      filtered = [projectsOverview[selectedProjectIdx]];
    }
    // Bar chart
    setBarData(filtered.map((p) => ({
      name: p?.project?.name || `Project ${p?.project?.project_id ?? ''}`,
      investment: Number(p?.investors?.totalInvestment ?? 0),
      expense: Number(p?.expenses?.totalExpense ?? 0)
    })));
    // Pie chart
    setPieData(filtered.map((p) => ({
      name: p?.project?.name || `Project ${p?.project?.project_id ?? ''}`,
      value: Number(p?.expenses?.totalExpense ?? 0)
    })).filter((d) => d.value > 0));
    // Line chart
    setLineData(filtered.map((p, idx) => ({
      name: p?.project?.name || `P${idx + 1}`,
      net: Number(p?.balance?.netBalance ?? 0),
    })));
    // Budget data
    setBudgetData(filtered.map((p) => ({
      name: p?.project?.name || `Project ${p?.project?.project_id ?? ''}`,
      budget: Number(p?.project?.estimated_budget ?? p?.project?.budget ?? 0)
    })));
    // Employees vs Expenses
    setEmpExpData(filtered.map((p) => ({
      name: p?.project?.name || `P${p?.project?.project_id ?? ''}`,
      employees: Number(p?.employees?.length ?? 0),
      expensesCount: Number(p?.expenses?.expenseCount ?? 0)
    })));
    // Status distribution
    if (selectedProjectIdx > -1) {
      const status = filtered[0]?.project?.status || 'Unknown';
      setStatusData([{ name: status, value: 1 }]);
    } else {
      const statuses = projectsOverview.reduce((acc, p) => {
        const status = p?.project?.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
      setStatusData(Object.entries(statuses).map(([name, value]) => ({ name, value })));
    }
  }, [selectedProjectIdx, projectsOverview]);

  const loadStats = async () => {
    try {
      const overview = await dashboardApi.getOverview();
      const all = await dashboardApi.getAllProjectsOverview();
      setStats({
        employees: overview.totalEmployees,
        projects: overview.totalProjects,
        investors: overview.totalInvestors,
        totalExpenses: overview.totalExpenses,
      });
      setProjectsOverview(all);
    } catch (error) {
      setStats({ employees: 0, projects: 0, investors: 0, totalExpenses: 0 });
      setProjectsOverview([]);
    }
  };

  const barColors = { investment: 'hsl(var(--success))', expense: 'hsl(var(--destructive))' };
  const pieColors = ['#6366F1', '#06B6D4', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#14B8A6'];

  return (
    <div className="flex w-full min-h-screen bg-background">
      <Sidebar role="reviewer" />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 space-y-6 animate-fade-in">

         

          {/* Four total cards, unchanged */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Employees"
              value={stats.employees}
              icon={Users}
            
              gradient="secondary"
            />
            <StatsCard
              title="Active Projects"
              value={stats.projects}
              icon={FolderKanban}
            
              gradient="primary"
            />
            <StatsCard
              title="Total Investors"
              value={stats.investors}
              icon={TrendingUp}
             
              gradient="success"
            />
            <StatsCard
              title="Total Expenses"
              value={stats.totalExpenses}
              icon={DollarSign}
             
              gradient="warning"
            />
          </div>

           <Card className="p-4 mb-4 border-card bg-card">
            <label htmlFor="project-select" className="text-sm font-semibold mr-2">
              Show Data For:
            </label>
            <select
              id="project-select"
              className="bg-background border border-border/60 rounded-md px-3 py-1 text-sm"
              value={selectedProjectIdx}
              onChange={e => setSelectedProjectIdx(Number(e.target.value))}
            >
              <option value={-1}>All Projects</option>
              {projectsOverview.map((p, idx) => (
                <option key={p?.project?.project_id ?? idx} value={idx}>
                  {p?.project?.name || `Project ${p?.project?.project_id ?? idx + 1}`}
                </option>
              ))}
            </select>
          </Card>


          {/* All other charts, now selectively filtered */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 animate-fade-in-up backdrop-blur-sm bg-card/50 border-border/50">
              <h3 className="text-lg font-semibold mb-4">Earning</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <defs>
                    <linearGradient id="grad-expense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff6bcb" />
                      <stop offset="100%" stopColor="#7a3cff" />
                    </linearGradient>
                    <linearGradient id="grad-invest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00e7f0" />
                      <stop offset="100%" stopColor="#2dd4bf" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="expense" name="Total Expense" fill={barColors.expense} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="investment" name="Investment" fill={barColors.investment} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-6 animate-fade-in-up backdrop-blur-sm bg-card/50 border-border/50">
              <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    stroke="transparent"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`exp-cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, n, entry) => [formatCurrency(val), entry?.name]}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pieData.map((item, idx) => (
                  <div key={item.name + idx} className="flex items-center justify-between rounded-md border border-border/50 bg-muted/10 px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[idx % pieColors.length] }} />
                      <span className="text-sm truncate">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                  </div>
                ))}
                {pieData.length === 0 && (
                  <div className="text-sm text-muted-foreground">No expense data.</div>
                )}
              </div>
            </Card>
          </div>

          <Card className="p-6 animate-fade-in-up backdrop-blur-sm bg-card/50 border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Project Circle Insights</h3>
              {/* Synced dropdown (optional; can be omitted) */}
              {/* <select
                className="bg-background border border-border/60 rounded-md px-3 py-1 text-sm"
                value={selectedProjectIdx}
                onChange={e => setSelectedProjectIdx(Number(e.target.value))}
              >
                <option value={-1}>All Projects</option>
                {projectsOverview.map((p, idx) => (
                  <option key={p?.project?.project_id ?? idx} value={idx}>
                    {p?.project?.name || `Project ${p?.project?.project_id ?? idx + 1}`}
                  </option>
                ))}
              </select> */}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative">
                <ResponsiveContainer width="100%" height={320}>
                  {(() => {
                    // Always use filtered single project
                    const sel = selectedProjectIdx > -1 ? projectsOverview[selectedProjectIdx] : projectsOverview[0] || {};
                    const employees = Number(sel?.employees?.length || 0);
                    const expensesCount = Number(sel?.expenses?.expenseCount || 0);
                    const status = String(sel?.project?.status || '').toLowerCase();
                    const completion = status === 'completed' || status === 'complete' || status === 'done' ? 100 : status === 'in progress' || status === 'progress' ? 60 : status === 'started' ? 30 : 0;
                    const maxEmp = Math.max(1, ...empExpData.map((d) => Number(d?.employees || 0)));
                    const maxExp = Math.max(1, ...empExpData.map((d) => Number(d?.expensesCount || 0)));
                    const empPct = Math.min(100, Math.round((employees / maxEmp) * 100));
                    const expPct = Math.min(100, Math.round((expensesCount / maxExp) * 100));
                    const data = [
                      { name: 'Employees', value: empPct, fill: 'url(#rad-grad-emp)' },
                      { name: 'Expenses', value: expPct, fill: 'url(#rad-grad-exp)' },
                      { name: 'Completion', value: completion, fill: 'url(#rad-grad-comp)' },
                    ];
                    return (
                      <RadialBarChart innerRadius="25%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
                        <defs>
                          <linearGradient id="rad-grad-emp" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#22d3ee" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                          <linearGradient id="rad-grad-exp" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#fb923c" />
                            <stop offset="100%" stopColor="#f472b6" />
                          </linearGradient>
                          <linearGradient id="rad-grad-comp" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                        <RadialBar dataKey="value" cornerRadius={8} background clockWise label={false} />
                      </RadialBarChart>
                    );
                  })()}
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {(() => {
                  const sel = selectedProjectIdx > -1 ? projectsOverview[selectedProjectIdx] : projectsOverview[0] || {};
                  const status = String(sel?.project?.status || '').toLowerCase();
                  const isComplete = status === 'completed' || status === 'complete' || status === 'done';
                  const start = sel?.project?.start_date || sel?.project?.startDate;
                  const end = sel?.project?.end_date || sel?.project?.endDate;
                  const rows = [
                    { label: 'Employees', value: String(sel?.employees?.length || 0), color: 'bg-cyan-400' },
                    { label: 'Expenses', value: String(sel?.expenses?.expenseCount || 0), color: 'bg-orange-400' },
                    { label: 'Status', value: isComplete ? 'Completed' : (status ? status : 'Unknown'), color: isComplete ? 'bg-emerald-400' : 'bg-fuchsia-400' },
                    { label: 'Start', value: formatDate(start) || '—', color: 'bg-indigo-400' },
                    { label: 'End', value: formatDate(end) || 'TBD', color: 'bg-purple-400' },
                  ];
                  return rows.map((r, i) => (
                    <div key={r.label + i} className="flex items-center justify-between rounded-md border border-border/50 bg-muted/10 p-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full ${r.color}`}></span>
                        <span className="text-sm text-muted-foreground">{r.label}</span>
                      </div>
                      <span className="text-sm font-medium truncate max-w-[60%] text-right">{r.value}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </Card>

          <Card className="p-6 animate-fade-in-up backdrop-blur-sm bg-card/50 border-border/50">
            <h3 className="text-lg font-semibold mb-4">Net Balance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <defs>
                  <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="net"
                  stroke="url(#line-grad)"
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#a78bfa', stroke: '#22d3ee', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 animate-fade-in-up backdrop-blur-sm bg-card/50 border-border/50">
              <h3 className="text-lg font-semibold mb-4">Budget Chart</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <defs>
                    <linearGradient id="grad-primary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="budget" name="Budget" fill="url(#grad-primary)" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 animate-fade-in-up backdrop-blur-sm bg-card/50 border-border/50">
              <h3 className="text-lg font-semibold mb-4">Profit/Loss Overview</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={
                  selectedProjectIdx === -1
                    ? projectsOverview.map(p => ({
                      name: p?.project?.name || `Project ${p?.project?.project_id ?? ''}`,
                      profit: p?.balance?.profitOrLoss === 'Profit' ? Number(p?.balance?.netBalance || 0) : 0,
                      loss: p?.balance?.profitOrLoss === 'Loss' ? Math.abs(Number(p?.balance?.netBalance || 0)) : 0
                    }))
                    : [{
                      name: projectsOverview[selectedProjectIdx]?.project?.name || `Project ${projectsOverview[selectedProjectIdx]?.project?.project_id ?? ''}`,
                      profit: projectsOverview[selectedProjectIdx]?.balance?.profitOrLoss === 'Profit'
                        ? Number(projectsOverview[selectedProjectIdx]?.balance?.netBalance || 0)
                        : 0,
                      loss: projectsOverview[selectedProjectIdx]?.balance?.profitOrLoss === 'Loss'
                        ? Math.abs(Number(projectsOverview[selectedProjectIdx]?.balance?.netBalance || 0)
                        ) : 0
                    }]
                }>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={70} />
                  <YAxis tickFormatter={value => new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    notation: 'compact',
                    maximumFractionDigits: 1
                  }).format(value)} />
                  <Tooltip
                    formatter={value => [new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0
                    }).format(value), value > 0 ? 'Profit' : 'Loss']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <defs>
                    <linearGradient id="profit-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <linearGradient id="loss-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="profit" name="Profit" fill="url(#profit-gradient)" radius={[8,8,0,0]} />
                  <Bar dataKey="loss" name="Loss" fill="url(#loss-gradient)" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
