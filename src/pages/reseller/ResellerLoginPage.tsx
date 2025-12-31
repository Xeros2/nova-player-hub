import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Users, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function ResellerLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem("reseller_auth", JSON.stringify({ email }));
    toast.success("Reseller login successful!");
    navigate("/reseller");
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-warning/5 via-transparent to-warning/5" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-warning/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-warning flex items-center justify-center">
              <Play className="w-6 h-6 text-warning-foreground fill-current" />
            </div>
            <div className="text-left">
              <span className="font-display font-bold text-2xl block">Nova Player</span>
              <span className="text-warning text-xs font-semibold">RESELLER PANEL</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Login to manage customer activations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6 border-warning/30">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="reseller@company.com"
              required
              className="bg-secondary/50 border-border h-12"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-secondary/50 border-border h-12"
            />
          </div>
          
          <Button 
            type="submit" 
            size="lg" 
            className="w-full bg-warning text-warning-foreground hover:bg-warning/90"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"} <ArrowRight className="w-5 h-5" />
          </Button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-6 text-muted-foreground text-sm">
          <Users className="w-4 h-4" />
          Reseller Access Only
        </div>
      </div>
    </div>
  );
}
