import { 
  BarChart3, 
  Smartphone, 
  Users, 
  Zap,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Key,
  Target,
  ArrowUpRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { useAdminStats } from "@/hooks/useAdminData";

const areaData = [
  { name: "Jan", activations: 120, trials: 45, revenue: 9600 },
  { name: "Feb", activations: 180, trials: 62, revenue: 14400 },
  { name: "Mar", activations: 240, trials: 78, revenue: 19200 },
  { name: "Apr", activations: 310, trials: 95, revenue: 24800 },
  { name: "May", activations: 420, trials: 110, revenue: 33600 },
  { name: "Jun", activations: 380, trials: 88, revenue: 30400 },
  { name: "Jul", activations: 450, trials: 120, revenue: 36000 },
  { name: "Aug", activations: 520, trials: 145, revenue: 41600 },
  { name: "Sep", activations: 610, trials: 160, revenue: 48800 },
  { name: "Oct", activations: 580, trials: 135, revenue: 46400 },
  { name: "Nov", activations: 720, trials: 180, revenue: 57600 },
  { name: "Dec", activations: 890, trials: 210, revenue: 71200 },
];

const pieData = [
  { name: "Lifetime", value: 4234, color: "hsl(var(--primary))" },
  { name: "Active", value: 3456, color: "hsl(var(--success))" },
  { name: "Trial", value: 892, color: "hsl(var(--warning))" },
  { name: "Expired", value: 1876, color: "hsl(var(--destructive))" },
];

const conversionData = [
  { name: "Trial Started", value: 5420, fill: "hsl(var(--warning))" },
  { name: "Converted to Lifetime", value: 3678, fill: "hsl(var(--primary))" },
  { name: "Expired/Churned", value: 1742, fill: "hsl(var(--muted))" },
];

const revenueBySource = [
  { name: "Direct Sales", value: 65200, color: "hsl(var(--primary))" },
  { name: "Resellers", value: 42800, color: "hsl(var(--warning))" },
  { name: "Renewals", value: 17680, color: "hsl(var(--success))" },
];

const topResellers = [
  { name: "TechStore Paris", activations: 342, revenue: "€5,130", trend: "+12%" },
  { name: "MediaShop Marseille", activations: 298, revenue: "€4,470", trend: "+8%" },
  { name: "Digital Lyon", activations: 245, revenue: "€3,675", trend: "+15%" },
  { name: "StreamPro Bordeaux", activations: 189, revenue: "€2,835", trend: "-3%" },
  { name: "Nova Store Toulouse", activations: 156, revenue: "€2,340", trend: "+5%" },
];

export default function AdminStatisticsPage() {
  const { data: stats } = useAdminStats();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Statistics & Analytics</h1>
        <p className="text-muted-foreground">Business performance metrics and insights.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
            <span className="flex items-center text-success text-sm">
              <TrendingUp className="w-4 h-4 mr-1" /> +12%
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-1">Total Devices</p>
          <p className="font-display font-bold text-3xl">{stats?.totalDevices?.toLocaleString() || "12,458"}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-success" />
            </div>
            <span className="flex items-center text-success text-sm">
              <TrendingUp className="w-4 h-4 mr-1" /> +24%
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-1">Monthly Revenue</p>
          <p className="font-display font-bold text-3xl">€{stats?.monthlyRevenue?.toLocaleString() || "15,420"}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <Key className="w-6 h-6 text-warning" />
            </div>
            <span className="flex items-center text-success text-sm">
              <TrendingUp className="w-4 h-4 mr-1" /> +18%
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-1">Licenses Sold</p>
          <p className="font-display font-bold text-3xl">{stats?.activatedLicenses?.toLocaleString() || "4,234"}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-cyan-500" />
            </div>
            <span className="flex items-center text-success text-sm">
              <TrendingUp className="w-4 h-4 mr-1" /> +5%
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-1">Conversion Rate</p>
          <p className="font-display font-bold text-3xl">{stats?.conversionRate || "67.8"}%</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Area Chart - Revenue & Activations */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-display font-semibold text-lg mb-6">Revenue & Activations Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActivations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Area type="monotone" dataKey="activations" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorActivations)" name="Activations" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Device Status */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold text-lg mb-6">Device Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold text-lg mb-6">Trial → Lifetime Conversion</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={120} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-success" />
              <span className="font-display font-semibold text-success">67.8% Conversion Rate</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              3,678 out of 5,420 trial users converted to lifetime
            </p>
          </div>
        </div>

        {/* Revenue by Source */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold text-lg mb-6">Revenue by Source</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueBySource}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {revenueBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                  formatter={(value: number) => `€${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {revenueBySource.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium">€{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Resellers */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-lg mb-6">Top Resellers (This Month)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">#</th>
                <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Reseller</th>
                <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Activations</th>
                <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Revenue</th>
                <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {topResellers.map((reseller, index) => (
                <tr key={reseller.name} className="border-b border-border/50">
                  <td className="py-3 px-4 font-display font-bold text-primary">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{reseller.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{reseller.activations}</td>
                  <td className="py-3 px-4 text-success font-medium">{reseller.revenue}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-sm ${
                      reseller.trend.startsWith("+") ? "text-success" : "text-destructive"
                    }`}>
                      {reseller.trend.startsWith("+") ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {reseller.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
