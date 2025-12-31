import { 
  Smartphone, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Zap,
  TrendingUp
} from "lucide-react";

const stats = [
  { label: "Total Devices", value: "12,458", icon: Smartphone, color: "text-primary" },
  { label: "Active Devices", value: "8,234", icon: CheckCircle2, color: "text-success" },
  { label: "Expired", value: "2,104", icon: AlertCircle, color: "text-destructive" },
  { label: "On Trial", value: "892", icon: Clock, color: "text-warning" },
  { label: "Lifetime", value: "1,228", icon: Zap, color: "text-primary" },
  { label: "Resellers", value: "156", icon: Users, color: "text-accent" },
];

const recentActivities = [
  { type: "activation", device: "NP-2024-XYZ789", action: "Lifetime activated", time: "2 min ago", reseller: "TechStore Paris" },
  { type: "trial", device: "NP-2024-ABC456", action: "Trial started", time: "5 min ago", reseller: "Direct" },
  { type: "expired", device: "NP-2024-DEF123", action: "Trial expired", time: "12 min ago", reseller: "Digital Lyon" },
  { type: "activation", device: "NP-2024-GHI789", action: "Lifetime activated", time: "18 min ago", reseller: "StreamPro" },
  { type: "new", device: "NP-2024-JKL012", action: "New device registered", time: "25 min ago", reseller: "Direct" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of all devices and activities.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-muted-foreground text-xs">{stat.label}</span>
            </div>
            <p className="font-display font-bold text-2xl">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-xl">Recent Activity</h2>
          <span className="text-primary text-sm font-medium flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> Live
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Device ID</th>
                <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Action</th>
                <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Reseller</th>
                <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((activity, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-sm">{activity.device}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-sm ${
                      activity.type === "activation" ? "text-success" :
                      activity.type === "trial" ? "text-warning" :
                      activity.type === "expired" ? "text-destructive" :
                      "text-muted-foreground"
                    }`}>
                      {activity.type === "activation" && <CheckCircle2 className="w-4 h-4" />}
                      {activity.type === "trial" && <Clock className="w-4 h-4" />}
                      {activity.type === "expired" && <AlertCircle className="w-4 h-4" />}
                      {activity.type === "new" && <Smartphone className="w-4 h-4" />}
                      {activity.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{activity.reseller}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{activity.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
