import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Search,
  Plus,
  CreditCard,
  MoreHorizontal,
  Mail,
  Phone
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Reseller {
  id: string;
  name: string;
  email: string;
  phone: string;
  credits: number;
  totalActivations: number;
  status: "active" | "inactive";
}

const mockResellers: Reseller[] = [
  { id: "1", name: "TechStore Paris", email: "contact@techstore.fr", phone: "+33 1 23 45 67 89", credits: 150, totalActivations: 342, status: "active" },
  { id: "2", name: "Digital Lyon", email: "info@digital-lyon.fr", phone: "+33 4 78 12 34 56", credits: 75, totalActivations: 198, status: "active" },
  { id: "3", name: "StreamPro Bordeaux", email: "contact@streampro.fr", phone: "+33 5 56 78 90 12", credits: 0, totalActivations: 89, status: "inactive" },
  { id: "4", name: "MediaShop Marseille", email: "ventes@mediashop.fr", phone: "+33 4 91 22 33 44", credits: 200, totalActivations: 456, status: "active" },
];

export default function AdminResellersPage() {
  const [resellers, setResellers] = useState<Reseller[]>(mockResellers);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [selectedReseller, setSelectedReseller] = useState<Reseller | null>(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [newReseller, setNewReseller] = useState({ name: "", email: "", phone: "", password: "" });

  const filteredResellers = resellers.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddReseller = () => {
    if (!newReseller.name || !newReseller.email) {
      toast.error("Please fill in required fields");
      return;
    }
    const reseller: Reseller = {
      id: Date.now().toString(),
      ...newReseller,
      credits: 0,
      totalActivations: 0,
      status: "active"
    };
    setResellers([...resellers, reseller]);
    setNewReseller({ name: "", email: "", phone: "", password: "" });
    setDialogOpen(false);
    toast.success("Reseller created successfully!");
  };

  const handleAddCredits = () => {
    if (!selectedReseller || !creditAmount) return;
    const amount = parseInt(creditAmount);
    setResellers(resellers.map(r => 
      r.id === selectedReseller.id ? { ...r, credits: r.credits + amount } : r
    ));
    setCreditDialogOpen(false);
    setCreditAmount("");
    toast.success(`Added ${amount} credits to ${selectedReseller.name}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Reseller Management</h1>
          <p className="text-muted-foreground">Create and manage reseller accounts.</p>
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
              <Button onClick={handleAddReseller} variant="glow" className="w-full">
                Create Reseller
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                    reseller.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
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
                  <DropdownMenuItem onClick={() => { setSelectedReseller(reseller); setCreditDialogOpen(true); }}>
                    <CreditCard className="w-4 h-4 mr-2" /> Add Credits
                  </DropdownMenuItem>
                  <DropdownMenuItem>View Activity</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Disable</DropdownMenuItem>
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
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Credits</p>
                <p className="font-display font-bold text-xl text-primary">{reseller.credits}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Total Activations</p>
                <p className="font-display font-bold text-xl">{reseller.totalActivations}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Credits Dialog */}
      <Dialog open={creditDialogOpen} onOpenChange={setCreditDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Add Credits</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-muted-foreground text-sm">
              Adding credits to: <span className="text-foreground font-medium">{selectedReseller?.name}</span>
            </p>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                placeholder="100"
                className="bg-secondary/50 border-border"
              />
            </div>
            <Button onClick={handleAddCredits} variant="glow" className="w-full">
              Add Credits
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
