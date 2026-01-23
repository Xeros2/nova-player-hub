import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Smartphone, 
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  MoreHorizontal,
  Ban,
  RefreshCw,
  Key,
  History,
  Link2,
  Unlink,
  Hash
} from "lucide-react";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDevices, useDeviceHistory, useSearchDeviceByPin, useLinkLicense, useUnlinkLicense, useStartDeviceTrial, useExpireDevice, useLicenses } from "@/hooks/useAdminData";
import type { Device, ActivationHistoryItem } from "@/services/adminApi";

const statusConfig = {
  ACTIVE: { color: "bg-success/10 text-success", icon: CheckCircle2 },
  LIFETIME: { color: "bg-primary/10 text-primary", icon: Zap },
  TRIAL: { color: "bg-warning/10 text-warning", icon: Clock },
  EXPIRED: { color: "bg-destructive/10 text-destructive", icon: AlertCircle },
  OPEN: { color: "bg-muted text-muted-foreground", icon: Smartphone },
};

export default function AdminDevicesPage() {
  const [search, setSearch] = useState("");
  const [pinSearch, setPinSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedDeviceForLink, setSelectedDeviceForLink] = useState<Device | null>(null);
  const [selectedLicenseId, setSelectedLicenseId] = useState<string>("");

  const { data, isLoading } = useDevices();
  const { data: historyData, isLoading: historyLoading } = useDeviceHistory(selectedDeviceId || "");
  const { data: licensesData } = useLicenses({ status: "available" });
  const searchByPin = useSearchDeviceByPin();
  const linkLicense = useLinkLicense();
  const unlinkLicense = useUnlinkLicense();
  const startTrial = useStartDeviceTrial();
  const expireDevice = useExpireDevice();

  const devices = data?.devices || [];
  const availableLicenses = licensesData?.licenses || [];

  const filteredDevices = devices.filter((device) => {
    const matchesSearch = device.deviceId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || device.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePinSearch = async () => {
    if (!pinSearch.trim()) {
      toast.error("Please enter a PIN");
      return;
    }
    await searchByPin.mutateAsync(pinSearch);
  };

  const handleBatchAction = (action: string) => {
    if (selectedDevices.length === 0) {
      toast.error("No devices selected");
      return;
    }
    toast.success(`${action} performed on ${selectedDevices.length} devices`);
    setSelectedDevices([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedDevices(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDevices.length === filteredDevices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(filteredDevices.map(d => d.id));
    }
  };

  const openHistory = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setHistoryDialogOpen(true);
  };

  const openLinkDialog = (device: Device) => {
    setSelectedDeviceForLink(device);
    setSelectedLicenseId("");
    setLinkDialogOpen(true);
  };

  const handleLinkLicense = async () => {
    if (!selectedDeviceForLink || !selectedLicenseId) {
      toast.error("Please select a license");
      return;
    }
    await linkLicense.mutateAsync({ 
      deviceId: selectedDeviceForLink.id, 
      licenseId: selectedLicenseId 
    });
    setLinkDialogOpen(false);
    setSelectedDeviceForLink(null);
    setSelectedLicenseId("");
  };

  const handleUnlinkLicense = async (device: Device) => {
    await unlinkLicense.mutateAsync(device.id);
  };

  const handleStartTrial = async (deviceId: string) => {
    await startTrial.mutateAsync(deviceId);
  };

  const handleExpire = async (deviceId: string) => {
    await expireDevice.mutateAsync(deviceId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Device Management</h1>
        <p className="text-muted-foreground">Search, filter, and manage all registered devices.</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Device ID (UUID)..."
              className="pl-10 bg-secondary/50 border-border"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 bg-secondary/50 border-border">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="LIFETIME">Lifetime</SelectItem>
              <SelectItem value="TRIAL">Trial</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* PIN Search */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <div className="relative flex-1 max-w-xs">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={pinSearch}
              onChange={(e) => setPinSearch(e.target.value)}
              placeholder="Search by PIN..."
              className="pl-10 bg-secondary/50 border-border"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={handlePinSearch}
            disabled={searchByPin.isPending}
          >
            {searchByPin.isPending ? "Searching..." : "Search PIN"}
          </Button>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedDevices.length > 0 && (
        <div className="glass-card p-4 flex items-center justify-between">
          <span className="text-sm">{selectedDevices.length} devices selected</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleBatchAction("Start Trial")}>
              <Clock className="w-4 h-4 mr-1" /> Start Trial
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBatchAction("Expire")}>
              <Ban className="w-4 h-4 mr-1" /> Expire
            </Button>
            <Button variant="default" size="sm" onClick={() => handleBatchAction("Activate Lifetime")}>
              <Zap className="w-4 h-4 mr-1" /> Lifetime
            </Button>
          </div>
        </div>
      )}

      {/* Devices Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="py-4 px-4 text-left">
                  <input 
                    type="checkbox" 
                    checked={selectedDevices.length === filteredDevices.length && filteredDevices.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">Device ID</th>
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">Status</th>
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">License</th>
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">Reseller</th>
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">Activation Date</th>
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    No devices found
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => {
                  const status = statusConfig[device.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={device.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="py-4 px-4">
                        <input 
                          type="checkbox" 
                          checked={selectedDevices.includes(device.id)}
                          onChange={() => toggleSelect(device.id)}
                          className="rounded border-border"
                        />
                      </td>
                      <td className="py-4 px-4 font-mono text-sm">{device.deviceId}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {device.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {device.licenseId ? (
                          <span className="inline-flex items-center gap-1 text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                            <Key className="w-3 h-3" />
                            Linked
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{device.reseller || "-"}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {device.activationDate ? new Date(device.activationDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-4 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem onClick={() => openHistory(device.id)}>
                              <History className="w-4 h-4 mr-2" /> View History
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {!device.licenseId ? (
                              <DropdownMenuItem onClick={() => openLinkDialog(device)}>
                                <Link2 className="w-4 h-4 mr-2" /> Link License
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleUnlinkLicense(device)}>
                                <Unlink className="w-4 h-4 mr-2" /> Unlink License
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStartTrial(device.id)}>
                              <Clock className="w-4 h-4 mr-2" /> Start Trial
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExpire(device.id)}>
                              <Ban className="w-4 h-4 mr-2" /> Expire
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="w-4 h-4 mr-2" /> Reset
                            </DropdownMenuItem>
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

      {/* History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Activation History</DialogTitle>
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
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                        {item.performerType}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No history found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Link License Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Link License to Device</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Device</p>
              <p className="font-mono text-sm">{selectedDeviceForLink?.deviceId}</p>
            </div>
            <div className="space-y-2">
              <Label>Select License</Label>
              <Select value={selectedLicenseId} onValueChange={setSelectedLicenseId}>
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue placeholder="Choose an available license" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {availableLicenses.length === 0 ? (
                    <SelectItem value="none" disabled>No available licenses</SelectItem>
                  ) : (
                    availableLicenses.map((license) => (
                      <SelectItem key={license.id} value={license.id}>
                        {license.licenseKey}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleLinkLicense} 
              variant="glow" 
              className="w-full"
              disabled={linkLicense.isPending || !selectedLicenseId}
            >
              {linkLicense.isPending ? "Linking..." : "Link License"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
