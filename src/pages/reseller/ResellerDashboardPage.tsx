import { 
  CreditCard, 
  Zap, 
  History,
  TrendingUp
} from "lucide-react";

export default function ResellerDashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Credits</p>
              <p className="font-display font-bold text-2xl">150</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">This Month</p>
              <p className="font-display font-bold text-2xl">24</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <History className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total</p>
              <p className="font-display font-bold text-2xl">342</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Revenue</p>
              <p className="font-display font-bold text-2xl">€5,130</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-4">Quick Actions</h3>
        <p className="text-muted-foreground text-sm">Use the sidebar to activate devices, add playlists, or view your history.</p>
      </div>
    </div>
  );
}
