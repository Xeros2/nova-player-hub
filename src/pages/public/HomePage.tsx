import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { 
  Smartphone, 
  Tv, 
  Tablet, 
  Monitor, 
  ArrowRight,
  Shield,
  Zap,
  List,
  Users,
  Download
} from "lucide-react";

// Logos
import novaLogo from "@/assets/nova-logo.png";
import downloaderLogo from "@/assets/logos/downloader-logo.svg";
import windowsStoreLogo from "@/assets/logos/windows-store-logo.svg";
import appleStoreLogo from "@/assets/logos/apple-store-logo.svg";
import googlePlayLogo from "@/assets/logos/google-play-logo.svg";

export default function HomePage() {
  const { t } = useTranslation();

  const devices = [
    { icon: Smartphone, label: t("home.devices.androidPhone") },
    { icon: Tablet, label: t("home.devices.androidTablet") },
    { icon: Tv, label: t("home.devices.androidTV") },
    { icon: Monitor, label: t("home.devices.fireTV") },
  ];

  const features = [
    { 
      icon: Shield, 
      title: t("home.features.lifetimeActivation"), 
      description: t("home.features.lifetimeActivationDesc")
    },
    { 
      icon: List, 
      title: t("home.features.unlimitedPlaylists"), 
      description: t("home.features.unlimitedPlaylistsDesc")
    },
    { 
      icon: Zap, 
      title: t("home.features.instantSetup"), 
      description: t("home.features.instantSetupDesc")
    },
    { 
      icon: Users, 
      title: t("home.features.multiDevice"), 
      description: t("home.features.multiDeviceDesc")
    },
  ];

  const steps = [
    { number: "01", title: t("home.howItWorks.step1Title"), description: t("home.howItWorks.step1Desc") },
    { number: "02", title: t("home.howItWorks.step2Title"), description: t("home.howItWorks.step2Desc") },
    { number: "03", title: t("home.howItWorks.step3Title"), description: t("home.howItWorks.step3Desc") },
    { number: "04", title: t("home.howItWorks.step4Title"), description: t("home.howItWorks.step4Desc") },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              {t("home.badge")}
            </div>
            
            {/* Nova Logo */}
            <div className="mb-8">
              <img 
                src={novaLogo} 
                alt="Nova Player" 
                className="h-24 md:h-32 w-auto mx-auto drop-shadow-[0_0_30px_rgba(0,200,255,0.3)]"
              />
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t("home.title")}{" "}
              <span className="gradient-text">{t("home.titleHighlight")}</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("home.description")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/activate">
                <Button variant="glow" size="xl" className="w-full sm:w-auto">
                  {t("home.activateNow")} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/playlists">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  {t("home.learnMore")}
                </Button>
              </Link>
            </div>
            
            {/* Compatible Devices */}
            <div className="flex flex-wrap justify-center gap-6">
              {devices.map((device) => (
                <div key={device.label} className="flex items-center gap-2 text-muted-foreground">
                  <device.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm">{device.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="glass-card p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-10">
                {t("home.download.title")} <span className="gradient-text">{t("home.download.titleHighlight")}</span>
              </h2>
              
              {/* Download Cards Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {/* Windows */}
                <div className="bg-card/60 border border-border/30 rounded-xl p-6 text-center flex flex-col">
                  <div className="flex items-center justify-center mx-auto mb-4">
                    <img src={windowsStoreLogo} alt="Windows Store" className="h-10 w-auto rounded-md" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-3">Windows</h3>
                  
                  {/* QR Code Placeholder */}
                  <div className="bg-white rounded-lg p-3 w-28 h-28 mx-auto mb-4 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <rect x="10" y="10" width="25" height="25" fill="#000"/>
                      <rect x="65" y="10" width="25" height="25" fill="#000"/>
                      <rect x="10" y="65" width="25" height="25" fill="#000"/>
                      <rect x="15" y="15" width="15" height="15" fill="#fff"/>
                      <rect x="70" y="15" width="15" height="15" fill="#fff"/>
                      <rect x="15" y="70" width="15" height="15" fill="#fff"/>
                      <rect x="20" y="20" width="5" height="5" fill="#000"/>
                      <rect x="75" y="20" width="5" height="5" fill="#000"/>
                      <rect x="20" y="75" width="5" height="5" fill="#000"/>
                      <rect x="40" y="10" width="5" height="5" fill="#000"/>
                      <rect x="50" y="15" width="5" height="5" fill="#000"/>
                      <rect x="45" y="25" width="5" height="5" fill="#000"/>
                      <rect x="40" y="40" width="20" height="20" fill="#000"/>
                      <rect x="45" y="45" width="10" height="10" fill="#fff"/>
                      <rect x="65" y="45" width="5" height="5" fill="#000"/>
                      <rect x="75" y="50" width="5" height="5" fill="#000"/>
                      <rect x="70" y="60" width="10" height="5" fill="#000"/>
                      <rect x="85" y="70" width="5" height="10" fill="#000"/>
                      <rect x="65" y="75" width="10" height="5" fill="#000"/>
                      <rect x="45" y="65" width="5" height="10" fill="#000"/>
                      <rect x="10" y="45" width="5" height="10" fill="#000"/>
                      <rect x="20" y="50" width="10" height="5" fill="#000"/>
                    </svg>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">{t("home.download.scanToDownload")}</p>
                  
                  <Button variant="outline" size="sm" className="gap-2 mt-auto">
                    <Download className="w-4 h-4" />
                    {t("home.download.downloadBtn")}
                  </Button>
                </div>

                {/* Apple Store */}
                <div className="bg-card/60 border border-border/30 rounded-xl p-6 text-center flex flex-col">
                  <div className="flex items-center justify-center mx-auto mb-4">
                    <img src={appleStoreLogo} alt="App Store" className="h-10 w-auto rounded-md" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-3">App Store</h3>
                  
                  {/* QR Code Placeholder */}
                  <div className="bg-white rounded-lg p-3 w-28 h-28 mx-auto mb-4 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <rect x="10" y="10" width="25" height="25" fill="#000"/>
                      <rect x="65" y="10" width="25" height="25" fill="#000"/>
                      <rect x="10" y="65" width="25" height="25" fill="#000"/>
                      <rect x="15" y="15" width="15" height="15" fill="#fff"/>
                      <rect x="70" y="15" width="15" height="15" fill="#fff"/>
                      <rect x="15" y="70" width="15" height="15" fill="#fff"/>
                      <rect x="20" y="20" width="5" height="5" fill="#000"/>
                      <rect x="75" y="20" width="5" height="5" fill="#000"/>
                      <rect x="20" y="75" width="5" height="5" fill="#000"/>
                      <rect x="45" y="10" width="5" height="10" fill="#000"/>
                      <rect x="40" y="25" width="10" height="5" fill="#000"/>
                      <rect x="55" y="20" width="5" height="5" fill="#000"/>
                      <rect x="40" y="40" width="20" height="20" fill="#000"/>
                      <rect x="45" y="45" width="10" height="10" fill="#fff"/>
                      <rect x="10" y="50" width="10" height="5" fill="#000"/>
                      <rect x="25" y="45" width="5" height="10" fill="#000"/>
                      <rect x="70" y="45" width="10" height="5" fill="#000"/>
                      <rect x="80" y="55" width="5" height="5" fill="#000"/>
                      <rect x="65" y="70" width="15" height="5" fill="#000"/>
                      <rect x="75" y="80" width="5" height="10" fill="#000"/>
                      <rect x="50" y="70" width="5" height="15" fill="#000"/>
                    </svg>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">{t("home.download.scanToDownload")}</p>
                  
                  <Button variant="outline" size="sm" className="gap-2 mt-auto">
                    <Download className="w-4 h-4" />
                    {t("home.download.downloadBtn")}
                  </Button>
                </div>

                {/* Google Play */}
                <div className="bg-card/60 border border-border/30 rounded-xl p-6 text-center flex flex-col">
                  <div className="flex items-center justify-center mx-auto mb-4">
                    <img src={googlePlayLogo} alt="Google Play" className="h-10 w-auto rounded-md" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-3">Google Play</h3>
                  
                  {/* QR Code Placeholder */}
                  <div className="bg-white rounded-lg p-3 w-28 h-28 mx-auto mb-4 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <rect x="10" y="10" width="25" height="25" fill="#000"/>
                      <rect x="65" y="10" width="25" height="25" fill="#000"/>
                      <rect x="10" y="65" width="25" height="25" fill="#000"/>
                      <rect x="15" y="15" width="15" height="15" fill="#fff"/>
                      <rect x="70" y="15" width="15" height="15" fill="#fff"/>
                      <rect x="15" y="70" width="15" height="15" fill="#fff"/>
                      <rect x="20" y="20" width="5" height="5" fill="#000"/>
                      <rect x="75" y="20" width="5" height="5" fill="#000"/>
                      <rect x="20" y="75" width="5" height="5" fill="#000"/>
                      <rect x="40" y="15" width="5" height="5" fill="#000"/>
                      <rect x="50" y="10" width="10" height="5" fill="#000"/>
                      <rect x="45" y="30" width="5" height="5" fill="#000"/>
                      <rect x="40" y="40" width="20" height="20" fill="#000"/>
                      <rect x="45" y="45" width="10" height="10" fill="#fff"/>
                      <rect x="15" y="45" width="5" height="10" fill="#000"/>
                      <rect x="25" y="50" width="5" height="5" fill="#000"/>
                      <rect x="70" y="50" width="5" height="10" fill="#000"/>
                      <rect x="80" y="45" width="5" height="5" fill="#000"/>
                      <rect x="85" y="65" width="5" height="15" fill="#000"/>
                      <rect x="65" y="80" width="10" height="5" fill="#000"/>
                      <rect x="45" y="70" width="10" height="5" fill="#000"/>
                    </svg>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">{t("home.download.scanToDownload")}</p>
                  
                  <Button variant="outline" size="sm" className="gap-2 mt-auto">
                    <Download className="w-4 h-4" />
                    {t("home.download.downloadBtn")}
                  </Button>
                </div>

                {/* Downloader */}
                <div className="bg-card/60 border border-border/30 rounded-xl p-6 text-center flex flex-col">
                  <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                    <img src={downloaderLogo} alt="Downloader" className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-3">Downloader</h3>
                  
                  {/* Code Display */}
                  <div className="bg-muted/50 rounded-lg p-4 w-28 h-28 mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-orange-500/30">
                    <span className="font-mono text-2xl font-bold text-orange-400">851628</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">{t("home.download.useThisCode")}</p>
                  
                  <Button variant="outline" size="sm" className="gap-2 mt-auto border-orange-500/30 hover:bg-orange-500/10">
                    <Download className="w-4 h-4" />
                    {t("home.download.downloadBtn")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              {t("home.features.title")} <span className="gradient-text">{t("home.features.titleHighlight")}</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("home.features.description")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div 
                key={feature.title} 
                className="glass-card p-6 hover-glow group transition-all duration-300 hover:border-primary/30"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              {t("home.howItWorks.title")} <span className="gradient-text">{t("home.howItWorks.titleHighlight")}</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("home.howItWorks.description")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-4">
                    <span className="font-display font-bold text-2xl text-primary">{step.number}</span>
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent rtl:right-[60%] rtl:left-auto rtl:bg-gradient-to-l" />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/activate">
              <Button variant="glow" size="lg">
                {t("home.howItWorks.activateDevice")} <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
            <div className="relative z-10">
              <h2 className="font-display text-4xl font-bold mb-4">
                {t("home.cta.title")}
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                {t("home.cta.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/activate">
                  <Button variant="glow" size="lg">
                    {t("home.cta.getStarted")}
                  </Button>
                </Link>
                <Link to="/become-reseller">
                  <Button variant="outline" size="lg">
                    {t("home.cta.becomeReseller")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
