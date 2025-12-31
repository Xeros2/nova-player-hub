import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Smartphone, 
  Tv, 
  Tablet, 
  Monitor, 
  Check, 
  ArrowRight,
  Shield,
  Zap,
  List,
  Users
} from "lucide-react";

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
