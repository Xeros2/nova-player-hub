import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Search,
  Phone,
  Mail
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const resellers = [
  {
    name: "TechStore Paris",
    city: "Paris",
    region: "Île-de-France",
    phone: "+33 1 23 45 67 89",
    email: "contact@techstore-paris.fr"
  },
  {
    name: "Digital Lyon",
    city: "Lyon",
    region: "Auvergne-Rhône-Alpes",
    phone: "+33 4 78 12 34 56",
    email: "info@digital-lyon.fr"
  },
  {
    name: "MediaShop Marseille",
    city: "Marseille",
    region: "Provence-Alpes-Côte d'Azur",
    phone: "+33 4 91 22 33 44",
    email: "ventes@mediashop.fr"
  },
  {
    name: "StreamPro Bordeaux",
    city: "Bordeaux",
    region: "Nouvelle-Aquitaine",
    phone: "+33 5 56 78 90 12",
    email: "contact@streampro.fr"
  },
  {
    name: "IPTV Expert Lille",
    city: "Lille",
    region: "Hauts-de-France",
    phone: "+33 3 20 11 22 33",
    email: "expert@iptv-lille.fr"
  },
  {
    name: "Nova Store Toulouse",
    city: "Toulouse",
    region: "Occitanie",
    phone: "+33 5 61 44 55 66",
    email: "store@nova-toulouse.fr"
  }
];

export default function FindResellerPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredResellers = resellers.filter(
    (reseller) =>
      reseller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reseller.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reseller.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <MapPin className="w-4 h-4" />
            {t("findReseller.badge")}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {t("findReseller.title")} <span className="gradient-text">{t("findReseller.titleHighlight")}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("findReseller.description")}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("findReseller.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-secondary/50 border-border"
            />
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="glass-card aspect-[16/9] md:aspect-[21/9] flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <p className="text-muted-foreground">{t("findReseller.mapComingSoon")}</p>
            </div>
          </div>
        </div>

        {/* Reseller List */}
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold mb-6">
            {t("findReseller.authorizedTitle")} <span className="gradient-text">{t("findReseller.authorizedTitleHighlight")}</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {filteredResellers.map((reseller) => (
              <div key={reseller.name} className="glass-card p-6 hover-glow transition-all duration-300">
                <h3 className="font-display font-semibold text-lg mb-1">{reseller.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {reseller.city}, {reseller.region}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4 text-primary" />
                    {reseller.phone}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    {reseller.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredResellers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("findReseller.noResults")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
