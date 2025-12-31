import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Smartphone, 
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  MoreHorizontal,
  Play,
  Ban,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Device {
  id: string;
  deviceId: string;
  status: "ACTIVE" | "EXPIRED" | "TRIAL" | "OPEN" | "LIFETIME";
  reseller: string;
  activationDate: string | null;
  trialDays: number;
}

const mockDevices: Device[] = [
  { id: "1", deviceId: "NP-2024-ABC123", status: "LIFETIME", reseller: "TechStore Paris", activationDate: "Dec 15, 2024", trialDays: 0 },
  { id: "2", deviceId: "NP-2024-DEF456", status: "ACTIVE", reseller: "Digital Lyon", activationDate: "Dec 18, 2024", trialDays: 0 },
  { id: "3", deviceId: "NP-2024-GHI789", status: "TRIAL", reseller: "Direct", activationDate: "Dec 28, 2024", trialDays: 5 },
  { id: "4", deviceId: "NP-2024-JKL012", status: "EXPIRED", reseller: "StreamPro", activationDate: "Nov 20, 2024", trialDays: 0 },
  { id: "5", deviceId: "NP-2024-MNO345", status: "OPEN", reseller: "-", activationDate: null, trialDays: 0 },
];

const statusConfig = {
  ACTIVE: { color: "bg-success/10 text-success", icon: CheckCircle2 },
  LIFETIME: { color: "bg-primary/10 text-primary", icon: Zap },
  TRIAL: { color: "bg-warning/10 text-warning", icon: Clock },
  EXPIRED: { color: "bg-destructive/10 text-destructive", icon: AlertCircle },
  OPEN: { color: "bg-muted text-muted-foreground", icon: Smartphone },
};

export default function AdminDevicesPage() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  const filteredDevices = devices.filter((device) => {
    const matchesSearch = device.deviceId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || device.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (deviceId: string, action: string) => {
    toast.success(`${action} action performed on ${deviceId}`);
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Device Management</h1>
        <p className="text-muted-foreground">Search, filter, and manage all registered devices.</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Device ID..."
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
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">Reseller</th>
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">Activation Date</th>
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((device) => {
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
                    <td className="py-4 px-4 text-sm text-muted-foreground">{device.reseller}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{device.activationDate || "-"}</td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem onClick={() => handleAction(device.deviceId, "Activate Lifetime")}>
                            <Zap className="w-4 h-4 mr-2" /> Activate Lifetime
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction(device.deviceId, "Start Trial")}>
                            <Clock className="w-4 h-4 mr-2" /> Start Trial
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction(device.deviceId, "Expire")}>
                            <Ban className="w-4 h-4 mr-2" /> Expire
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction(device.deviceId, "Reset")}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Reset
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
