import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  Download,
  ExternalLink
} from "lucide-react";

// Platform logos
import samsungLogo from "@/assets/logos/samsung-tv-logo.svg";
import lgLogo from "@/assets/logos/lg-tv-logo.svg";
import rokuLogo from "@/assets/logos/roku-logo.svg";
import windowsLogo from "@/assets/logos/windows-store-logo.svg";
import downloaderLogo from "@/assets/logos/downloader-logo.svg";

const devices = [
  { icon: Smartphone, label: "Android Phone" },
  { icon: Tablet, label: "Android Tablet" },
  { icon: Tv, label: "Android TV" },
  { icon: Monitor, label: "Fire TV Stick" },
];

const features = [
  { 
    icon: Shield, 
    title: "Lifetime Activation", 
    description: "Pay once, use forever. No recurring fees or subscriptions." 
  },
  { 
    icon: List, 
    title: "Unlimited Playlists", 
    description: "Add as many M3U playlists as you need, local or from server." 
  },
  { 
    icon: Zap, 
    title: "Instant Setup", 
    description: "Simple activation with Device ID and PIN. Ready in minutes." 
  },
  { 
    icon: Users, 
    title: "Multi-Device", 
    description: "Use on all your compatible devices with one account." 
  },
];

const steps = [
  { number: "01", title: "Install App", description: "Download Nova Player from your app store" },
  { number: "02", title: "Get Your ID", description: "Open the app to see your Device ID and PIN" },
  { number: "03", title: "Login", description: "Visit our website and login with your credentials" },
  { number: "04", title: "Activate", description: "Choose lifetime or trial activation" },
];

const platformBadges = [
  { name: "Google Play", image: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg", url: "#" },
  { name: "App Store", image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg", url: "#" },
];

const tvPlatforms = [
  { name: "Samsung Smart TV", logo: samsungLogo, url: "#" },
  { name: "LG TV", logo: lgLogo, url: "#" },
  { name: "Roku TV", logo: rokuLogo, url: "#" },
  { name: "Windows Store", logo: windowsLogo, url: "#" },
];

export default function HomePage() {
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
              Lifetime Activation Available
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Stream Everything with{" "}
              <span className="gradient-text">Nova Player</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The ultimate IPTV player for Android devices. Simple setup, unlimited playlists, and lifetime activation. Your entertainment, your way.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/activate">
                <Button variant="glow" size="xl" className="w-full sm:w-auto">
                  Activate Now <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/playlists">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Learn More
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
                Download <span className="gradient-text">Nova Player</span>
              </h2>
              
              {/* Platform Badges */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {platformBadges.map((platform) => (
                  <a 
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 hover:opacity-80 transition-opacity"
                  >
                    <img 
                      src={platform.image} 
                      alt={platform.name} 
                      className="h-full w-auto"
                    />
                  </a>
                ))}
              </div>
              
              {/* TV Platform Logos */}
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {tvPlatforms.map((platform) => (
                  <a 
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 hover:opacity-80 transition-opacity hover:scale-105 transform transition-transform"
                  >
                    <img 
                      src={platform.logo} 
                      alt={platform.name} 
                      className="h-full w-auto"
                    />
                  </a>
                ))}
              </div>

              {/* Downloader App Section */}
              <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-6 mb-10 max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img src={downloaderLogo} alt="Downloader App" className="w-16 h-16" />
                  <div className="text-center sm:text-left flex-1">
                    <h3 className="font-display font-semibold text-lg mb-1">Use Downloader App</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      Install via Downloader app with code: <span className="text-primary font-mono font-bold">851628</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Available on Fire TV, Android TV, and other streaming devices
                    </p>
                  </div>
                  <a 
                    href="#" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2 border-orange-500/30 hover:bg-orange-500/10">
                      <ExternalLink className="w-4 h-4" />
                      Get Downloader
                    </Button>
                  </a>
                </div>
              </div>
              
              {/* Download Links */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {/* Android / Fire TV */}
                <div className="bg-card/60 border border-border/30 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">Android / Fire TV</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Download code: <span className="text-primary font-mono">851628</span>
                  </p>
                  <a 
                    href="#" 
                    className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download APK
                  </a>
                </div>
                
                {/* Samsung TV */}
                <div className="bg-card/60 border border-border/30 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Tv className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">Samsung TV</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Short App Link
                  </p>
                  <a 
                    href="#" 
                    className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Link
                  </a>
                </div>
                
                {/* Windows Desktop */}
                <div className="bg-card/60 border border-border/30 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Monitor className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">Windows Desktop</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Windows 10/11
                  </p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download .exe
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
              Why Choose <span className="gradient-text">Nova Player</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the best IPTV player with features designed for simplicity and power.
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
              How to <span className="gradient-text">Get Started</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Activate your device in just a few simple steps.
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
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/activate">
              <Button variant="glow" size="lg">
                Activate Your Device <ArrowRight className="w-5 h-5" />
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
                Ready to Start Streaming?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                Join thousands of satisfied users. Activate your device today and enjoy unlimited entertainment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/activate">
                  <Button variant="glow" size="lg">
                    Get Started Now
                  </Button>
                </Link>
                <Link to="/become-reseller">
                  <Button variant="outline" size="lg">
                    Become a Reseller
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
