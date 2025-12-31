import { 
  BarChart3, 
  Smartphone, 
  Users, 
  Zap,
  TrendingUp,
  TrendingDown
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
  Cell
} from "recharts";

const areaData = [
  { name: "Jan", activations: 120, trials: 45 },
  { name: "Feb", activations: 180, trials: 62 },
  { name: "Mar", activations: 240, trials: 78 },
  { name: "Apr", activations: 310, trials: 95 },
  { name: "May", activations: 420, trials: 110 },
  { name: "Jun", activations: 380, trials: 88 },
  { name: "Jul", activations: 450, trials: 120 },
  { name: "Aug", activations: 520, trials: 145 },
  { name: "Sep", activations: 610, trials: 160 },
  { name: "Oct", activations: 580, trials: 135 },
  { name: "Nov", activations: 720, trials: 180 },
  { name: "Dec", activations: 890, trials: 210 },
];

const pieData = [
  { name: "Lifetime", value: 4234, color: "hsl(187, 100%, 50%)" },
  { name: "Active", value: 3456, color: "hsl(142, 76%, 45%)" },
  { name: "Trial", value: 892, color: "hsl(45, 93%, 47%)" },
  { name: "Expired", value: 1876, color: "hsl(0, 84%, 60%)" },
];

const topResellers = [
  { name: "TechStore Paris", activations: 342, revenue: "€5,130" },
  { name: "MediaShop Marseille", activations: 298, revenue: "€4,470" },
  { name: "Digital Lyon", activations: 245, revenue: "€3,675" },
  { name: "StreamPro Bordeaux", activations: 189, revenue: "€2,835" },
  { name: "Nova Store Toulouse", activations: 156, revenue: "€2,340" },
];

export default function AdminStatisticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Statistics</h1>
        <p className="text-muted-foreground">Analytics and performance metrics.</p>
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
          <p className="font-display font-bold text-3xl">12,458</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-success" />
            </div>
            <span className="flex items-center text-success text-sm">
              <TrendingUp className="w-4 h-4 mr-1" /> +24%
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-1">This Month</p>
          <p className="font-display font-bold text-3xl">890</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-warning" />
            </div>
            <span className="flex items-center text-success text-sm">
              <TrendingUp className="w-4 h-4 mr-1" /> +8%
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-1">Active Resellers</p>
          <p className="font-display font-bold text-3xl">156</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-destructive" />
            </div>
            <span className="flex items-center text-destructive text-sm">
              <TrendingDown className="w-4 h-4 mr-1" /> -5%
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-1">Churn Rate</p>
          <p className="font-display font-bold text-3xl">3.2%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-display font-semibold text-lg mb-6">Activations Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorActivations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTrials" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(45, 93%, 47%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(45, 93%, 47%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 18%)" />
                <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(222, 47%, 10%)", 
                    border: "1px solid hsl(222, 47%, 18%)",
                    borderRadius: "8px"
                  }}
                />
                <Area type="monotone" dataKey="activations" stroke="hsl(187, 100%, 50%)" fillOpacity={1} fill="url(#colorActivations)" />
                <Area type="monotone" dataKey="trials" stroke="hsl(45, 93%, 47%)" fillOpacity={1} fill="url(#colorTrials)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
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
                    backgroundColor: "hsl(222, 47%, 10%)", 
                    border: "1px solid hsl(222, 47%, 18%)",
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
              </tr>
            </thead>
            <tbody>
              {topResellers.map((reseller, index) => (
                <tr key={reseller.name} className="border-b border-border/50">
                  <td className="py-3 px-4 font-display font-bold text-primary">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{reseller.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{reseller.activations}</td>
                  <td className="py-3 px-4 text-success font-medium">{reseller.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
