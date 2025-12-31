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
  Send
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const benefitIcons = [DollarSign, Users, BarChart3, Headphones];
const benefitKeys = ["b1", "b2", "b3", "b4"];
const featureKeys = ["f1", "f2", "f3", "f4", "f5", "f6"];

export default function BecomeResellerPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("reseller.toast.success"));
    setFormData({ name: "", email: "", phone: "", company: "", message: "" });
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            {t("reseller.badge")}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {t("reseller.title")} <span className="gradient-text">{t("reseller.titleHighlight")}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("reseller.description")}
          </p>
        </div>

        {/* Benefits */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid sm:grid-cols-2 gap-6">
            {benefitKeys.map((key, index) => {
              const Icon = benefitIcons[index];
              return (
                <div key={key} className="glass-card p-6 hover-glow transition-all duration-300">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{t(`reseller.benefits.${key}.title`)}</h3>
                  <p className="text-muted-foreground text-sm">{t(`reseller.benefits.${key}.description`)}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features & Form */}
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Features */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-6">
              {t("reseller.features.title")} <span className="gradient-text">{t("reseller.features.titleHighlight")}</span>
            </h2>
            <div className="glass-card p-6">
              <ul className="space-y-4">
                {featureKeys.map((key) => (
                  <li key={key} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span>{t(`reseller.features.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Application Form */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-6">
              {t("reseller.form.title")} <span className="gradient-text">{t("reseller.form.titleHighlight")}</span>
            </h2>
            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("reseller.form.fullName")}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t("reseller.form.fullNamePlaceholder")}
                    required
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("reseller.form.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t("reseller.form.emailPlaceholder")}
                    required
                    className="bg-secondary/50 border-border"
                  />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("reseller.form.phone")}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t("reseller.form.phonePlaceholder")}
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">{t("reseller.form.company")}</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder={t("reseller.form.companyPlaceholder")}
                    className="bg-secondary/50 border-border"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">{t("reseller.form.message")}</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t("reseller.form.messagePlaceholder")}
                  rows={4}
                  className="bg-secondary/50 border-border resize-none"
                />
              </div>
              
              <Button type="submit" variant="glow" size="lg" className="w-full">
                <Send className="w-5 h-5" /> {t("reseller.form.submit")}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
