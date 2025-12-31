import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Smartphone,
  Key,
  Globe,
  LogIn,
  Zap,
  CheckCircle2
} from "lucide-react";
import { useTranslation } from "react-i18next";

const stepIcons = [Smartphone, Key, Globe, Zap];
const stepKeys = ["s1", "s2", "s3", "s4"];
const trialFeatureKeys = ["f1", "f2", "f3", "f4"];
const lifetimeFeatureKeys = ["f1", "f2", "f3", "f4"];

export default function ActivatePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            {t("activate.badge")}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {t("activate.title")} <span className="gradient-text">{t("activate.titleHighlight")}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("activate.description")}
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="space-y-6">
            {stepKeys.map((key, index) => {
              const Icon = stepIcons[index];
              return (
                <div 
                  key={key} 
                  className="glass-card p-6 flex gap-6 items-start hover-glow transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-primary font-display font-bold text-sm">{t("common.step")} {index + 1}</span>
                    </div>
                    <h3 className="font-display font-semibold text-xl mb-2">{t(`activate.steps.${key}.title`)}</h3>
                    <p className="text-muted-foreground">{t(`activate.steps.${key}.description`)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activation Types */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="font-display text-3xl font-bold text-center mb-8">
            {t("activate.types.chooseTitle")} <span className="gradient-text">{t("activate.types.chooseTitleHighlight")}</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Trial */}
            <div className="glass-card p-8 relative">
              <h3 className="font-display font-bold text-2xl mb-2">{t("activate.types.trial.title")}</h3>
              <p className="text-muted-foreground mb-6">{t("activate.types.trial.description")}</p>
              <ul className="space-y-3 mb-8">
                {trialFeatureKeys.map((fKey) => (
                  <li key={fKey} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    {t(`activate.types.trial.features.${fKey}`)}
                  </li>
                ))}
              </ul>
              <Link to="/panel">
                <Button variant="outline" size="lg" className="w-full">
                  {t("activate.types.trial.cta")} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Lifetime */}
            <div className="glass-card p-8 relative border-primary/50 glow-effect">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                {t("activate.types.recommended")}
              </div>
              <h3 className="font-display font-bold text-2xl mb-2">{t("activate.types.lifetime.title")}</h3>
              <p className="text-muted-foreground mb-6">{t("activate.types.lifetime.description")}</p>
              <ul className="space-y-3 mb-8">
                {lifetimeFeatureKeys.map((fKey) => (
                  <li key={fKey} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    {t(`activate.types.lifetime.features.${fKey}`)}
                  </li>
                ))}
              </ul>
              <Link to="/panel">
                <Button variant="glow" size="lg" className="w-full">
                  {t("activate.types.lifetime.cta")} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{t("activate.cta.alreadyHave")}</p>
          <Link to="/panel">
            <Button variant="default" size="lg">
              <LogIn className="w-5 h-5" /> {t("activate.cta.goToPanel")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
