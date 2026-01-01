import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

export function PublicFooter() {
  const { t } = useTranslation();

  return (
    <footer className="bg-card/50 border-t border-border/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                Nova+
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t("nav.home")}</Link></li>
              <li><Link to="/playlists" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t("nav.managePlaylists")}</Link></li>
              <li><Link to="/activate" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t("nav.activate")}</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t("nav.faq")}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">{t("footer.resources")}</h4>
            <ul className="space-y-2">
              <li><Link to="/news" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t("nav.news")}</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t("nav.blog")}</Link></li>
              <li><Link to="/become-reseller" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t("nav.becomeReseller")}</Link></li>
              <li><Link to="/find-reseller" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t("nav.findReseller")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">{t("footer.contactUs")}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-primary" />
                support@nova-player.fr
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-primary" />
                +33 1 23 45 67 89
              </li>
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                Paris, France
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            {t("footer.copyright")}
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t("footer.privacyPolicy")}</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t("footer.termsOfService")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
