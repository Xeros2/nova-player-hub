import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Search,
  Plus,
  Key,
  MoreHorizontal,
  Mail,
  Phone,
  History,
  Ban,
  CheckCircle2,
  Package
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useResellers, useCreateReseller, useAssignLicensesToReseller, useToggleResellerStatus, useResellerHistory } from "@/hooks/useAdminData";
import type { Reseller, ActivationHistoryItem } from "@/services/adminApi";

export default function AdminResellersPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedReseller, setSelectedReseller] = useState<Reseller | null>(null);
  const [licenseQuantity, setLicenseQuantity] = useState("");
  const [newReseller, setNewReseller] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    password: "",
    licenseQuota: "50"
  });

  const { data, isLoading } = useResellers();
  const { data: historyData, isLoading: historyLoading } = useResellerHistory(selectedReseller?.id || "");
  const createReseller = useCreateReseller();
  const assignLicenses = useAssignLicensesToReseller();
  const toggleStatus = useToggleResellerStatus();

  const resellers = data?.resellers || [];

  const filteredResellers = resellers.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const totalResellers = resellers.length;
  const activeResellers = resellers.filter(r => r.status === "active").length;
  const totalStock = resellers.reduce((sum, r) => sum + r.licenseStock, 0);
  const totalActivations = resellers.reduce((sum, r) => sum + r.totalActivations, 0);

  const handleAddReseller = async () => {
    if (!newReseller.name || !newReseller.email || !newReseller.password) {
      toast.error("Please fill in required fields");
      return;
    }
    await createReseller.mutateAsync({
      ...newReseller,
      licenseQuota: parseInt(newReseller.licenseQuota)
    });
    setNewReseller({ name: "", email: "", phone: "", password: "", licenseQuota: "50" });
    setDialogOpen(false);
  };

  const handleAssignLicenses = async () => {
    if (!selectedReseller || !licenseQuantity) return;
    const quantity = parseInt(licenseQuantity);
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    await assignLicenses.mutateAsync({
      resellerId: selectedReseller.id,
      quantity
    });
    setAssignDialogOpen(false);
    setLicenseQuantity("");
  };

  const handleToggleStatus = async (reseller: Reseller) => {
    await toggleStatus.mutateAsync(reseller.id);
  };

  const openHistory = (reseller: Reseller) => {
    setSelectedReseller(reseller);
    setHistoryDialogOpen(true);
  };

  const openAssignDialog = (reseller: Reseller) => {
    setSelectedReseller(reseller);
    setLicenseQuantity("");
    setAssignDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Reseller Management</h1>
          <p className="text-muted-foreground">Create and manage reseller accounts with license quotas.</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="glow">
              <Plus className="w-5 h-5" /> Add Reseller
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display">Create New Reseller</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input
                  value={newReseller.name}
                  onChange={(e) => setNewReseller({ ...newReseller, name: e.target.value })}
                  placeholder="Reseller Company"
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newReseller.email}
                  onChange={(e) => setNewReseller({ ...newReseller, email: e.target.value })}
                  placeholder="email@company.com"
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={newReseller.phone}
                  onChange={(e) => setNewReseller({ ...newReseller, phone: e.target.value })}
                  placeholder="+33 ..."
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Password *</Label>
                <Input
                  type="password"
                  value={newReseller.password}
                  onChange={(e) => setNewReseller({ ...newReseller, password: e.target.value })}
                  placeholder="••••••••"
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>License Quota</Label>
                <Input
                  type="number"
                  value={newReseller.licenseQuota}
                  onChange={(e) => setNewReseller({ ...newReseller, licenseQuota: e.target.value })}
                  placeholder="50"
                  className="bg-secondary/50 border-border"
                />
                <p className="text-xs text-muted-foreground">Maximum licenses this reseller can hold</p>
              </div>
              <Button 
                onClick={handleAddReseller} 
                variant="glow" 
                className="w-full"
                disabled={createReseller.isPending}
              >
                {createReseller.isPending ? "Creating..." : "Create Reseller"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Resellers</p>
              <p className="font-display font-bold text-2xl">{totalResellers}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Active</p>
              <p className="font-display font-bold text-2xl">{activeResellers}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-cyan-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Stock</p>
              <p className="font-display font-bold text-2xl">{totalStock}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <Key className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Activations</p>
              <p className="font-display font-bold text-2xl">{totalActivations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search resellers..."
          className="pl-10 bg-secondary/50 border-border"
        />
      </div>

      {/* Resellers Grid */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredResellers.map((reseller) => (
            <div key={reseller.id} className="glass-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold">{reseller.name}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      reseller.status === "active" 
                        ? "bg-success/10 text-success" 
                        : "bg-destructive/10 text-destructive"
                    }`}>
                      {reseller.status}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border">
                    <DropdownMenuItem onClick={() => openAssignDialog(reseller)}>
                      <Key className="w-4 h-4 mr-2" /> Assign Licenses
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openHistory(reseller)}>
                      <History className="w-4 h-4 mr-2" /> View History
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleToggleStatus(reseller)}
                      className={reseller.status === "active" ? "text-destructive" : "text-success"}
                    >
                      {reseller.status === "active" ? (
                        <><Ban className="w-4 h-4 mr-2" /> Block Reseller</>
                      ) : (
                        <><CheckCircle2 className="w-4 h-4 mr-2" /> Unblock Reseller</>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" /> {reseller.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" /> {reseller.phone}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Stock</p>
                  <p className="font-display font-bold text-xl text-primary">{reseller.licenseStock}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Quota</p>
                  <p className="font-display font-bold text-xl">{reseller.licenseQuota}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Activations</p>
                  <p className="font-display font-bold text-xl">{reseller.totalActivations}</p>
                </div>
              </div>

              {/* Stock Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Stock Usage</span>
                  <span>{Math.round((reseller.licenseStock / reseller.licenseQuota) * 100)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min((reseller.licenseStock / reseller.licenseQuota) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Licenses Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Assign Licenses</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Reseller</p>
              <p className="font-medium">{selectedReseller?.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Current stock: {selectedReseller?.licenseStock} / {selectedReseller?.licenseQuota}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Number of Licenses</Label>
              <Input
                type="number"
                min="1"
                value={licenseQuantity}
                onChange={(e) => setLicenseQuantity(e.target.value)}
                placeholder="10"
                className="bg-secondary/50 border-border"
              />
            </div>
            <Button 
              onClick={handleAssignLicenses} 
              variant="glow" 
              className="w-full"
              disabled={assignLicenses.isPending}
            >
              {assignLicenses.isPending ? "Assigning..." : "Assign Licenses"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              {selectedReseller?.name} - Activation History
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
            {historyLoading ? (
              <p className="text-center text-muted-foreground py-4">Loading...</p>
            ) : historyData && historyData.length > 0 ? (
              historyData.map((item: ActivationHistoryItem) => (
                <div key={item.id} className="flex gap-3 pb-4 border-b border-border last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.details}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{item.deviceId}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No history found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
