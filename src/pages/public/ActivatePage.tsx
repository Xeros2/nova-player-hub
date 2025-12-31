import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import novaLogo from "@/assets/nova-logo.png";

export default function ActivatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deviceId, setDeviceId] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deviceId || !pin) {
      toast({
        title: t("activate.errorTitle"),
        description: t("activate.errorDesc"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Store credentials
    localStorage.setItem("deviceId", deviceId);
    localStorage.setItem("pin", pin);
    
    toast({
      title: t("activate.loginSuccess"),
      description: t("activate.loginSuccessDesc"),
    });
    
    setLoading(false);
    navigate("/panel/activate");
  };

  return (
    <div className="min-h-screen py-20 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Hero */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="flex justify-center mb-6">
              <img 
                src={novaLogo} 
                alt="Nova Player" 
                className="h-20 w-auto"
              />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              {t("activate.badge")}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {t("activate.title")} <span className="gradient-text">{t("activate.titleHighlight")}</span>
            </h1>
            <p className="text-muted-foreground">
              {t("activate.loginTitle")}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="glass-card p-8 animate-slide-up">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="deviceId">{t("activate.macAddress")}</Label>
                <Input
                  id="deviceId"
                  type="text"
                  placeholder="XX:XX:XX:XX:XX:XX"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pin">{t("activate.deviceKey")}</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="••••••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <Button 
                type="submit" 
                variant="glow" 
                size="lg" 
                className="w-full"
                disabled={loading}
              >
                {loading ? t("activate.loggingIn") : t("activate.login")}
              </Button>
            </div>
          </form>

          {/* Help Text */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("activate.helpText")}
          </p>
        </div>
      </div>
    </div>
  );
}
