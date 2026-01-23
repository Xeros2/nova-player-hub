import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CreditCard, 
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCcw,
  DollarSign,
  TrendingUp,
  ReceiptText
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePayments } from "@/hooks/useAdminData";

const statusConfig = {
  completed: { color: "bg-success/10 text-success", icon: CheckCircle2, label: "Completed" },
  pending: { color: "bg-warning/10 text-warning", icon: Clock, label: "Pending" },
  failed: { color: "bg-destructive/10 text-destructive", icon: XCircle, label: "Failed" },
  refunded: { color: "bg-muted text-muted-foreground", icon: RefreshCcw, label: "Refunded" },
};

const sourceConfig = {
  stripe: { color: "bg-indigo-500/10 text-indigo-500", label: "Stripe" },
  paypal: { color: "bg-blue-500/10 text-blue-500", label: "PayPal" },
  manual: { color: "bg-slate-500/10 text-slate-400", label: "Manual" },
  reseller_credit: { color: "bg-warning/10 text-warning", label: "Reseller" },
};

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [periodFilter, setPeriodFilter] = useState<string>("all");

  const { data, isLoading } = usePayments();
  const payments = data?.payments || [];

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.reference.toLowerCase().includes(search.toLowerCase()) ||
      (payment.licenseKey && payment.licenseKey.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesSource = sourceFilter === "all" || payment.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  // Stats
  const totalRevenue = payments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalTransactions = payments.length;
  const avgTransaction = totalTransactions > 0 ? totalRevenue / payments.filter(p => p.status === "completed").length : 0;
  const pendingPayments = payments.filter(p => p.status === "pending").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Payments</h1>
        <p className="text-muted-foreground">Track transactions and revenue.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Revenue</p>
              <p className="font-display font-bold text-2xl">€{totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <ReceiptText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Transactions</p>
              <p className="font-display font-bold text-2xl">{totalTransactions}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-cyan-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Avg. Transaction</p>
              <p className="font-display font-bold text-2xl">€{avgTransaction.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Pending</p>
              <p className="font-display font-bold text-2xl">{pendingPayments}</p>
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
            placeholder="Search by reference or license..."
            className="pl-10 bg-secondary/50 border-border"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40 bg-secondary/50 border-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-full md:w-40 bg-secondary/50 border-border">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="stripe">Stripe</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="reseller_credit">Reseller</SelectItem>
          </SelectContent>
        </Select>
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-full md:w-40 bg-secondary/50 border-border">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">Reference</th>
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">Amount</th>
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">Source</th>
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">Status</th>
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">License</th>
                <th className="py-4 px-4 text-left text-muted-foreground text-sm font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No payments found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const status = statusConfig[payment.status];
                  const source = sourceConfig[payment.source];
                  const StatusIcon = status.icon;
                  
                  return (
                    <tr key={payment.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="py-4 px-4 font-mono text-sm">{payment.reference}</td>
                      <td className="py-4 px-4">
                        <span className={`font-display font-bold ${payment.status === "refunded" ? "text-muted-foreground line-through" : "text-foreground"}`}>
                          €{payment.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${source.color}`}>
                          {source.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground font-mono">
                        {payment.licenseKey || (payment.resellerName ? `Reseller: ${payment.resellerName}` : "-")}
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString()} {new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
