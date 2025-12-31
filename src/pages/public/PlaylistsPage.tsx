import { Button } from "@/components/ui/button";
import { 
  List, 
  Server, 
  HardDrive,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

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
