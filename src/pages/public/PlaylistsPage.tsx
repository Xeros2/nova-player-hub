import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Smartphone, Key, List } from "lucide-react";
import { toast } from "sonner";
import novaLogo from "@/assets/nova-logo.png";

export default function PlaylistsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deviceId, setDeviceId] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deviceId.trim() || !pin.trim()) {
      toast.error(t("playlists.errorTitle"), {
        description: t("playlists.errorDesc")
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    localStorage.setItem("playlist_device_id", deviceId);
    localStorage.setItem("playlist_pin", pin);
    
    toast.success(t("playlists.loginSuccess"), {
      description: t("playlists.loginSuccessDesc")
    });
    
    setLoading(false);
    navigate("/panel/playlists");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <img 
            src={novaLogo} 
            alt="Nova+" 
            className="h-20 md:h-28 w-auto mx-auto mb-6 drop-shadow-[0_0_30px_rgba(0,200,255,0.3)]"
          />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <List className="w-4 h-4" />
            {t("playlists.badge")}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {t("playlists.title").split(" ").slice(0, -1).join(" ")} <span className="gradient-text">{t("playlists.title").split(" ").slice(-1)}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            {t("playlists.subtitle")}
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="glass-card p-8">
            <h2 className="font-display text-2xl font-bold text-center mb-8">
              {t("playlists.loginTitle")}
            </h2>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="deviceId" className="flex items-center gap-2 text-sm font-medium">
                  <Smartphone className="w-4 h-4 text-primary" />
                  {t("playlists.deviceIdLabel")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="deviceId"
                  type="text"
                  placeholder={t("playlists.deviceId")}
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  className="h-12 bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deviceKey" className="flex items-center gap-2 text-sm font-medium">
                  <Key className="w-4 h-4 text-primary" />
                  {t("playlists.deviceKey")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="deviceKey"
                  type="password"
                  placeholder="PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="h-12 bg-background/50"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white border-0"
                disabled={loading}
              >
                {loading ? t("playlists.loggingIn") : t("playlists.login")}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-6">
              {t("playlists.helpText")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
