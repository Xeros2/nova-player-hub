import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function PanelActivatePage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleActivate = async (type: string) => {
    setLoading(type);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success(`${type} activation successful!`);
    setLoading(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Activate Device</h1>
        <p className="text-muted-foreground">Choose your activation type to start streaming.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Trial Activation */}
        <div className="glass-card p-8">
          <div className="w-14 h-14 rounded-xl bg-warning/10 border border-warning/30 flex items-center justify-center mb-6">
            <Clock className="w-7 h-7 text-warning" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-2">Trial Activation</h2>
          <p className="text-muted-foreground mb-6">
            Test all features for a limited time. Perfect for trying before you buy.
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Full feature access
            </li>
            <li className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-success" />
              7 days trial period
            </li>
            <li className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-success" />
              No payment required
            </li>
          </ul>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={() => handleActivate("Trial")}
            disabled={loading !== null}
          >
            {loading === "Trial" ? "Activating..." : "Start Trial"} <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Lifetime Activation */}
        <div className="glass-card p-8 border-primary/50 relative overflow-hidden">
          <div className="absolute -top-px left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            RECOMMENDED
          </div>
          
          <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
            <Zap className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-2">Lifetime Activation</h2>
          <p className="text-muted-foreground mb-6">
            One-time activation for permanent access. No recurring fees ever.
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Unlimited access forever
            </li>
            <li className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-success" />
              All premium features
            </li>
            <li className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Priority support
            </li>
            <li className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Free updates
            </li>
          </ul>
          <Button 
            variant="glow" 
            size="lg" 
            className="w-full"
            onClick={() => handleActivate("Lifetime")}
            disabled={loading !== null}
          >
            {loading === "Lifetime" ? "Activating..." : "Activate Lifetime"} <Zap className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Security Note */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold mb-1">Secure Activation</h3>
            <p className="text-muted-foreground text-sm">
              Your activation is tied to your device ID and is secured with encryption. 
              Contact support if you need to transfer your activation to a new device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
