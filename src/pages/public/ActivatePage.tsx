import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  ArrowRight, 
  Smartphone,
  Key,
  Globe,
  LogIn,
  Zap,
  CheckCircle2
} from "lucide-react";

const steps = [
  { 
    icon: Smartphone,
    number: "1",
    title: "Install Nova Player", 
    description: "Download the Nova Player app from your device's app store (Android TV, Fire TV, Android Phone/Tablet)." 
  },
  { 
    icon: Key,
    number: "2",
    title: "Get Your Credentials", 
    description: "Open the app and note your unique Device ID and PIN displayed on the screen." 
  },
  { 
    icon: Globe,
    number: "3",
    title: "Visit Our Website", 
    description: "Go to the User Panel on our website and enter your Device ID and PIN to log in." 
  },
  { 
    icon: Zap,
    number: "4",
    title: "Choose Your Activation", 
    description: "Select Lifetime activation for permanent access, or try our Trial to test the features first." 
  },
];

const activationTypes = [
  {
    title: "Trial Activation",
    description: "Test all features for a limited time before committing.",
    features: [
      "Full feature access",
      "Limited time period",
      "No payment required",
      "Perfect for testing"
    ],
    cta: "Start Trial",
    variant: "outline" as const
  },
  {
    title: "Lifetime Activation",
    description: "One-time payment for permanent access to all features.",
    features: [
      "Unlimited access forever",
      "All premium features",
      "Priority support",
      "No recurring fees"
    ],
    cta: "Activate Lifetime",
    variant: "glow" as const,
    highlighted: true
  }
];

export default function ActivatePage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Simple Activation Process
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Activate Your <span className="gradient-text">Device</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Follow these simple steps to activate Nova Player on your device and start streaming.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div 
                key={step.number} 
                className="glass-card p-6 flex gap-6 items-start hover-glow transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-primary font-display font-bold text-sm">STEP {step.number}</span>
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activation Types */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="font-display text-3xl font-bold text-center mb-8">
            Choose Your <span className="gradient-text">Activation Type</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {activationTypes.map((type) => (
              <div 
                key={type.title}
                className={`glass-card p-8 relative ${type.highlighted ? 'border-primary/50 glow-effect' : ''}`}
              >
                {type.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    RECOMMENDED
                  </div>
                )}
                <h3 className="font-display font-bold text-2xl mb-2">{type.title}</h3>
                <p className="text-muted-foreground mb-6">{type.description}</p>
                <ul className="space-y-3 mb-8">
                  {type.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/panel">
                  <Button variant={type.variant} size="lg" className="w-full">
                    {type.cta} <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Already have your Device ID and PIN?</p>
          <Link to="/panel">
            <Button variant="default" size="lg">
              <LogIn className="w-5 h-5" /> Go to User Panel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
