import { 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Calendar,
  Zap
} from "lucide-react";

// Simulated device data
const deviceData = {
  deviceId: "NP-2024-ABC123",
  status: "ACTIVE",
  activationType: "LIFETIME",
  trialDaysLeft: 0,
  activationDate: "December 15, 2024",
  expirationDate: null
};

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle2; label: string }> = {
  ACTIVE: { color: "text-success", icon: CheckCircle2, label: "Active" },
  LIFETIME: { color: "text-primary", icon: Zap, label: "Lifetime" },
  TRIAL: { color: "text-warning", icon: Clock, label: "Trial" },
  EXPIRED: { color: "text-destructive", icon: AlertCircle, label: "Expired" },
  OPEN: { color: "text-muted-foreground", icon: Smartphone, label: "Not Activated" }
};

export default function PanelDashboardPage() {
  const status = statusConfig[deviceData.status] || statusConfig.OPEN;
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your device status.</p>
      </div>

      {/* Status Card */}
      <div className="glass-card p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-display font-bold text-2xl">{deviceData.deviceId}</h2>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-card text-sm font-medium ${status.color}`}>
                <StatusIcon className="w-4 h-4" />
                {status.label}
              </span>
            </div>
            <p className="text-muted-foreground">
              {deviceData.activationType === "LIFETIME" 
                ? "Your device has lifetime activation. Enjoy unlimited access!"
                : deviceData.status === "TRIAL"
                ? `Trial active - ${deviceData.trialDaysLeft} days remaining`
                : "Activate your device to start streaming"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Activation Type</p>
              <p className="font-display font-semibold text-lg">{deviceData.activationType}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Activation Date</p>
              <p className="font-display font-semibold text-lg">{deviceData.activationDate || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Expiration</p>
              <p className="font-display font-semibold text-lg">
                {deviceData.expirationDate || "Never"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-lg mb-4">Quick Tips</h3>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <span>Add your M3U playlists in the Playlists tab to start streaming</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <span>Your playlists will automatically sync to your device</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <span>Visit our FAQ page if you need help with setup</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
