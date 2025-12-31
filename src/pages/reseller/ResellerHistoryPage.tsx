import { History, Zap, Clock, CheckCircle2 } from "lucide-react";

const history = [
  { device: "NP-2024-ABC123", type: "Lifetime", date: "Dec 28, 2024", status: "success" },
  { device: "NP-2024-DEF456", type: "Trial", date: "Dec 27, 2024", status: "success" },
  { device: "NP-2024-GHI789", type: "Lifetime", date: "Dec 26, 2024", status: "success" },
  { device: "NP-2024-JKL012", type: "Trial", date: "Dec 25, 2024", status: "success" },
];

export default function ResellerHistoryPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Activation History</h1>
        <p className="text-muted-foreground">Your recent activations.</p>
      </div>
      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-border bg-secondary/30">
            <th className="py-4 px-4 text-left text-muted-foreground text-sm">Device ID</th>
            <th className="py-4 px-4 text-left text-muted-foreground text-sm">Type</th>
            <th className="py-4 px-4 text-left text-muted-foreground text-sm">Date</th>
            <th className="py-4 px-4 text-left text-muted-foreground text-sm">Status</th>
          </tr></thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-4 px-4 font-mono text-sm">{h.device}</td>
                <td className="py-4 px-4"><span className={`inline-flex items-center gap-1 text-sm ${h.type === "Lifetime" ? "text-primary" : "text-warning"}`}>
                  {h.type === "Lifetime" ? <Zap className="w-4 h-4" /> : <Clock className="w-4 h-4" />} {h.type}
                </span></td>
                <td className="py-4 px-4 text-muted-foreground text-sm">{h.date}</td>
                <td className="py-4 px-4"><CheckCircle2 className="w-5 h-5 text-success" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
