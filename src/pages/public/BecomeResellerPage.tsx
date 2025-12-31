import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  DollarSign, 
  Headphones,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Send
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Commissions",
    description: "Earn generous commissions on every activation you sell."
  },
  {
    icon: Users,
    title: "Dedicated Panel",
    description: "Access your own reseller panel to manage customers and activations."
  },
  {
    icon: BarChart3,
    title: "Real-time Stats",
    description: "Track your sales, commissions, and customer activity in real-time."
  },
  {
    icon: Headphones,
    title: "Priority Support",
    description: "Get dedicated support for you and your customers."
  }
];

const features = [
  "Instant device activation",
  "Credit-based system",
  "Bulk activation options",
  "Customer playlist management",
  "Detailed activity history",
  "24/7 panel access"
];

export default function BecomeResellerPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Application submitted! We'll review and contact you soon.");
    setFormData({ name: "", email: "", phone: "", company: "", message: "" });
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            Partner With Us
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Become a <span className="gradient-text">Reseller</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join our reseller network and earn by selling Nova Player activations. Get access to exclusive tools and support.
          </p>
        </div>

        {/* Benefits */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="glass-card p-6 hover-glow transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features & Form */}
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Features */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-6">
              Reseller Panel <span className="gradient-text">Features</span>
            </h2>
            <div className="glass-card p-6">
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Application Form */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-6">
              Apply <span className="gradient-text">Now</span>
            </h2>
            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    required
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    className="bg-secondary/50 border-border"
                  />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+33 ..."
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Your company"
                    className="bg-secondary/50 border-border"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Tell us about yourself</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your experience, expected volume, etc."
                  rows={4}
                  className="bg-secondary/50 border-border resize-none"
                />
              </div>
              
              <Button type="submit" variant="glow" size="lg" className="w-full">
                <Send className="w-5 h-5" /> Submit Application
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
