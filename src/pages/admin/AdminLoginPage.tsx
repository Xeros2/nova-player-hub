import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Shield, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo login
    localStorage.setItem("admin_auth", JSON.stringify({ username }));
    toast.success("Admin login successful!");
    navigate("/admin");
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-destructive/5" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-destructive/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-destructive flex items-center justify-center">
              <Play className="w-6 h-6 text-destructive-foreground fill-current" />
            </div>
            <div className="text-left">
              <span className="font-display font-bold text-2xl block">Nova Player</span>
              <span className="text-destructive text-xs font-semibold">ADMIN PANEL</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Admin authentication required
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6 border-destructive/30">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
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
            variant="destructive" 
            size="lg" 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Login"} <ArrowRight className="w-5 h-5" />
          </Button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-6 text-muted-foreground text-sm">
          <Shield className="w-4 h-4" />
          Secured Admin Access
        </div>
      </div>
    </div>
  );
}
