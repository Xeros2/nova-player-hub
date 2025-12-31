import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  List, 
  Plus, 
  Trash2,
  Server,
  Link as LinkIcon
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Playlist {
  id: string;
  name: string;
  url: string;
  type: "user" | "server";
  addedAt: string;
}

const initialPlaylists: Playlist[] = [
  { id: "1", name: "Main Playlist", url: "http://example.com/playlist1.m3u", type: "user", addedAt: "Dec 20, 2024" },
  { id: "2", name: "Sports Channels", url: "http://example.com/sports.m3u", type: "user", addedAt: "Dec 22, 2024" },
  { id: "3", name: "Premium Package", url: "http://server.nova-player.fr/premium.m3u", type: "server", addedAt: "Dec 15, 2024" },
];

export default function PanelPlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ name: "", url: "" });

  const handleAdd = () => {
    if (!newPlaylist.name || !newPlaylist.url) {
      toast.error("Please fill in all fields");
      return;
    }

    const playlist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylist.name,
      url: newPlaylist.url,
      type: "user",
      addedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    setPlaylists([...playlists, playlist]);
    setNewPlaylist({ name: "", url: "" });
    setDialogOpen(false);
    toast.success("Playlist added successfully!");
  };

  const handleDelete = (id: string) => {
    const playlist = playlists.find(p => p.id === id);
    if (playlist?.type === "server") {
      toast.error("Server playlists cannot be removed");
      return;
    }
    setPlaylists(playlists.filter(p => p.id !== id));
    toast.success("Playlist removed");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Playlists</h1>
          <p className="text-muted-foreground">Manage your M3U playlists here.</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="glow">
              <Plus className="w-5 h-5" /> Add Playlist
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display">Add New Playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Playlist Name</Label>
                <Input
                  id="name"
                  value={newPlaylist.name}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                  placeholder="My Playlist"
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Playlist URL</Label>
                <Input
                  id="url"
                  value={newPlaylist.url}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, url: e.target.value })}
                  placeholder="http://example.com/playlist.m3u"
                  className="bg-secondary/50 border-border"
                />
              </div>
              <Button onClick={handleAdd} variant="glow" className="w-full">
                Add Playlist
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Playlist List */}
      <div className="space-y-4">
        {playlists.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <List className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No playlists added yet.</p>
          </div>
        ) : (
          playlists.map((playlist) => (
            <div key={playlist.id} className="glass-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                {playlist.type === "server" ? (
                  <Server className="w-6 h-6 text-primary" />
                ) : (
                  <List className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-semibold truncate">{playlist.name}</h3>
                  {playlist.type === "server" && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      Server
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm truncate flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" />
                  {playlist.url}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-muted-foreground text-xs mb-2">{playlist.addedAt}</p>
                {playlist.type === "user" && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(playlist.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
