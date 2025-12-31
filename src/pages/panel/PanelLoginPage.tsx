import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Smartphone, Key, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function PanelLoginPage() {
  const navigate = useNavigate();
  const [deviceId, setDeviceId] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, accept any credentials
    localStorage.setItem("panel_auth", JSON.stringify({ deviceId, pin }));
    toast.success("Login successful!");
    navigate("/panel");
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Play className="w-6 h-6 text-primary-foreground fill-current" />
            </div>
            <span className="font-display font-bold text-2xl">Nova Player</span>
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">User Panel</h1>
          <p className="text-muted-foreground text-sm">
            Enter your Device ID and PIN to access your panel
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="deviceId" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              Device ID
            </Label>
            <Input
              id="deviceId"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="Enter your Device ID"
              required
              className="bg-secondary/50 border-border h-12"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pin" className="flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              PIN
            </Label>
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter your PIN"
              required
              className="bg-secondary/50 border-border h-12"
            />
          </div>
          
          <Button 
            type="submit" 
            variant="glow" 
            size="lg" 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"} <ArrowRight className="w-5 h-5" />
          </Button>
        </form>

        {/* Help Text */}
        <p className="text-center text-muted-foreground text-sm mt-6">
          Find your Device ID and PIN in the Nova Player app on your device.
        </p>
      </div>
    </div>
  );
}
