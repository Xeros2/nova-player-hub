import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Key, 
  Search,
  Plus,
  CheckCircle2,
  Package,
  XCircle,
  MoreHorizontal,
  Zap,
  Users,
  ShoppingBag
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLicenses, useCreateLicenses, useActivateLicense, useRevokeLicense } from "@/hooks/useAdminData";

const statusConfig = {
  available: { color: "bg-success/10 text-success", icon: Package, label: "Available" },
  activated: { color: "bg-primary/10 text-primary", icon: CheckCircle2, label: "Activated" },
  revoked: { color: "bg-destructive/10 text-destructive", icon: XCircle, label: "Revoked" },
};

const originConfig = {
  direct_sale: { color: "bg-cyan-500/10 text-cyan-500", icon: ShoppingBag, label: "Direct Sale" },
  reseller: { color: "bg-warning/10 text-warning", icon: Users, label: "Reseller" },
};

export default function AdminLicensesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [originFilter, setOriginFilter] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [deviceCode, setDeviceCode] = useState("");

  const { data, isLoading } = useLicenses();
  const createLicenses = useCreateLicenses();
  const activateLicense = useActivateLicense();
  const revokeLicense = useRevokeLicense();

  const licenses = data?.licenses || [];
  
  const filteredLicenses = licenses.filter((license) => {
    const matchesSearch = license.licenseKey.toLowerCase().includes(search.toLowerCase()) ||
      (license.deviceCode && license.deviceCode.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || license.status === statusFilter;
    const matchesOrigin = originFilter === "all" || license.origin === originFilter;
    return matchesSearch && matchesStatus && matchesOrigin;
  });

  // Stats
  const totalLicenses = licenses.length;
  const activatedLicenses = licenses.filter(l => l.status === "activated").length;
  const availableLicenses = licenses.filter(l => l.status === "available").length;
  const resellerLicenses = licenses.filter(l => l.origin === "reseller").length;

  const handleCreate = async () => {
    const qty = parseInt(quantity);
    if (qty < 1 || qty > 100) {
      toast.error("Quantity must be between 1 and 100");
      return;
    }
    await createLicenses.mutateAsync(qty);
    setCreateDialogOpen(false);
    setQuantity("1");
  };

  const handleActivate = async () => {
    if (!selectedLicense || !deviceCode.trim()) {
      toast.error("Please enter a device code");
      return;
    }
    await activateLicense.mutateAsync({ licenseId: selectedLicense, deviceCode: deviceCode.trim() });
    setActivateDialogOpen(false);
    setDeviceCode("");
    setSelectedLicense(null);
  };

  const handleRevoke = async (licenseId: string) => {
    await revokeLicense.mutateAsync(licenseId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">License Management</h1>
          <p className="text-muted-foreground">Create, manage, and track lifetime licenses.</p>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="glow">
              <Plus className="w-5 h-5" /> Create Licenses
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display">Create Lifetime Licenses</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1"
                  className="bg-secondary/50 border-border"
                />
                <p className="text-xs text-muted-foreground">Create up to 100 licenses at once</p>
              </div>
              <Button 
                onClick={handleCreate} 
                variant="glow" 
                className="w-full"
                disabled={createLicenses.isPending}
              >
                {createLicenses.isPending ? "Creating..." : `Create ${quantity} License(s)`}
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
              <Key className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Licenses</p>
              <p className="font-display font-bold text-2xl">{totalLicenses}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Activated</p>
              <p className="font-display font-bold text-2xl">{activatedLicenses}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-cyan-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Available</p>
              <p className="font-display font-bold text-2xl">{availableLicenses}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Reseller Stock</p>
              <p className="font-display font-bold text-2xl">{resellerLicenses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by license key or device code..."
            className="pl-10 bg-secondary/50 border-border"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40 bg-secondary/50 border-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="activated">Activated</SelectItem>
            <SelectItem value="revoked">Revoked</SelectItem>
          </SelectContent>
        </Select>
        <Select value={originFilter} onValueChange={setOriginFilter}>
          <SelectTrigger className="w-full md:w-40 bg-secondary/50 border-border">
            <SelectValue placeholder="Origin" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Origins</SelectItem>
            <SelectItem value="direct_sale">Direct Sale</SelectItem>
            <SelectItem value="reseller">Reseller</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Licenses Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">License Key</th>
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">Status</th>
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">Origin</th>
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">Device</th>
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">Activated</th>
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filteredLicenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No licenses found
                  </td>
                </tr>
              ) : (
                filteredLicenses.map((license) => {
                  const status = statusConfig[license.status];
                  const origin = originConfig[license.origin];
                  const StatusIcon = status.icon;
                  const OriginIcon = origin.icon;
                  
                  return (
                    <tr key={license.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="py-4 px-4 font-mono text-sm">{license.licenseKey}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${origin.color}`}>
                          <OriginIcon className="w-3.5 h-3.5" />
                          {origin.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground font-mono">
                        {license.deviceCode || "-"}
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {license.activatedAt ? new Date(license.activatedAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-4 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            {license.status === "available" && (
                              <>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedLicense(license.id);
                                  setActivateDialogOpen(true);
                                }}>
                                  <Zap className="w-4 h-4 mr-2" /> Activate on Device
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Users className="w-4 h-4 mr-2" /> Assign to Reseller
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            {license.status !== "revoked" && (
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleRevoke(license.id)}
                              >
                                <XCircle className="w-4 h-4 mr-2" /> Revoke License
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activate Dialog */}
      <Dialog open={activateDialogOpen} onOpenChange={setActivateDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Activate License on Device</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Device Code (UUID)</Label>
              <Input
                value={deviceCode}
                onChange={(e) => setDeviceCode(e.target.value)}
                placeholder="NP-2024-XXXXXX"
                className="bg-secondary/50 border-border font-mono"
              />
            </div>
            <Button 
              onClick={handleActivate} 
              variant="glow" 
              className="w-full"
              disabled={activateLicense.isPending}
            >
              {activateLicense.isPending ? "Activating..." : "Activate License"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
