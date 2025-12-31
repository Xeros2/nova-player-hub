import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  List, 
  Server, 
  HardDrive,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Key
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import novaLogo from "@/assets/nova-logo.png";

const playlistTypes = [
  {
    icon: HardDrive,
    title: "Local Playlists",
    description: "Add M3U playlists stored on your device or local network.",
    features: [
      "Import from device storage",
      "Scan local network sources",
      "Offline access support",
      "Fast loading times"
    ]
  },
  {
    icon: Server,
    title: "Server Playlists",
    description: "Add playlists via URL from your IPTV provider.",
    features: [
      "Direct URL import",
      "Auto-refresh content",
      "EPG support",
      "Multiple providers"
    ]
  }
];

export default function PlaylistsPage() {
  const [deviceId, setDeviceId] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deviceId.trim() || !pin.trim()) {
      toast.error("Please enter both Mac Address and Device Key");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    localStorage.setItem("playlist_device_id", deviceId);
    localStorage.setItem("playlist_pin", pin);
    
    toast.success("Login successful! You can now manage your playlists.");
    setIsLoggedIn(true);
    setLoading(false);
  };

  // Login View
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="relative py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <img 
              src={novaLogo} 
              alt="Nova Player" 
              className="h-20 md:h-28 w-auto mx-auto mb-6 drop-shadow-[0_0_30px_rgba(0,200,255,0.3)]"
            />
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Manage Your <span className="gradient-text">Playlists</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Do it simply wherever you go
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="flex-1 flex items-start justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <div className="glass-card p-8">
              <h2 className="font-display text-2xl font-bold text-center mb-8">
                Login to add your playlist
              </h2>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="macAddress" className="flex items-center gap-2 text-sm font-medium">
                    <Smartphone className="w-4 h-4 text-primary" />
                    Mac Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="macAddress"
                    type="text"
                    placeholder="Enter your Device ID"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    className="h-12 bg-background/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deviceKey" className="flex items-center gap-2 text-sm font-medium">
                    <Key className="w-4 h-4 text-primary" />
                    Device Key <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="deviceKey"
                    type="password"
                    placeholder="Enter your PIN"
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
                  {loading ? "Logging in..." : "LOGIN"}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-6">
                Find your Mac Address and Device Key in the Nova Player app settings on your device.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged In - Playlist Management View
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <List className="w-4 h-4" />
            Playlist Management
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Manage Your <span className="gradient-text">Playlists</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nova Player supports unlimited playlists from both local sources and remote servers. Organize your content your way.
          </p>
        </div>

        {/* Playlist Types */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {playlistTypes.map((type) => (
              <div key={type.title} className="glass-card p-8 hover-glow transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
                  <type.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-bold text-2xl mb-3">{type.title}</h3>
                <p className="text-muted-foreground mb-6">{type.description}</p>
                <ul className="space-y-3">
                  {type.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* How to Manage */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-bold text-center mb-8">
            How to Manage <span className="gradient-text">Playlists</span>
          </h2>
          
          <div className="glass-card p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                  <Plus className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-lg mb-1">Add New Playlist</h4>
                  <p className="text-muted-foreground text-sm">
                    In the User Panel, navigate to "Playlists" tab. Enter a name and the playlist URL (M3U/M3U8 format), then save.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-lg mb-1">Remove Playlist</h4>
                  <p className="text-muted-foreground text-sm">
                    From the Playlists tab, click the delete button next to any playlist you want to remove.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Server className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-lg mb-1">Server-Assigned Playlists</h4>
                  <p className="text-muted-foreground text-sm">
                    Playlists assigned by resellers or admins will appear automatically and cannot be removed by users.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Ready to manage your playlists?</p>
          <Link to="/panel">
            <Button variant="glow" size="lg">
              Go to User Panel <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
