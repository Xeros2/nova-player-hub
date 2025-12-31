import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Smartphone, Key, Clock } from "lucide-react";
import { toast } from "sonner";

export default function ResellerActivatePage() {
  const [deviceId, setDeviceId] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const handleActivate = async (type: string) => {
    if (!deviceId || !pin) { toast.error("Enter Device ID and PIN"); return; }
    setLoading(type);
    await new Promise(r => setTimeout(r, 1500));
    toast.success(`${type} activation successful!`);
    setDeviceId(""); setPin(""); setLoading(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Activate Device</h1>
        <p className="text-muted-foreground">Enter customer's credentials to activate.</p>
      </div>

      <div className="glass-card p-6 max-w-lg">
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-primary" /> Device ID</Label>
            <Input value={deviceId} onChange={(e) => setDeviceId(e.target.value)} placeholder="NP-2024-XXXXXX" className="bg-secondary/50" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Key className="w-4 h-4 text-primary" /> PIN</Label>
            <Input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Customer PIN" className="bg-secondary/50" />
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleActivate("Trial")} disabled={loading !== null} className="flex-1">
            <Clock className="w-4 h-4" /> {loading === "Trial" ? "..." : "Start Trial"}
          </Button>
          <Button variant="glow" onClick={() => handleActivate("Lifetime")} disabled={loading !== null} className="flex-1">
            <Zap className="w-4 h-4" /> {loading === "Lifetime" ? "..." : "Lifetime"}
          </Button>
        </div>
        <p className="text-muted-foreground text-xs mt-4 text-center">1 credit per lifetime activation</p>
      </div>
    </div>
  );
}
