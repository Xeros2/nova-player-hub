import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqItems = [
  {
    question: "What is Nova Player?",
    answer: "Nova Player is a premium IPTV player application for Android devices (phones, tablets, Android TV, and Fire TV). It allows you to stream content from M3U playlists provided by your IPTV service."
  },
  {
    question: "What devices are compatible?",
    answer: "Nova Player works on Android phones, Android tablets, Android TV boxes, and Amazon Fire TV devices. Any device running Android 5.0 or higher is supported."
  },
  {
    question: "What is the difference between Trial and Lifetime activation?",
    answer: "Trial activation gives you temporary access to test all features. Lifetime activation is a one-time purchase that gives you permanent access to the app with no recurring fees."
  },
  {
    question: "How do I find my Device ID and PIN?",
    answer: "After installing Nova Player, open the app and your unique Device ID and PIN will be displayed on the main screen. Use these credentials to log in to the User Panel on our website."
  },
  {
    question: "Can I use Nova Player on multiple devices?",
    answer: "Each device requires its own activation. When you install the app on a new device, it will generate a unique Device ID and PIN that needs to be activated separately."
  },
  {
    question: "What playlist formats are supported?",
    answer: "Nova Player supports M3U and M3U8 playlist formats. You can add playlists via URL or import local files from your device storage."
  },
  {
    question: "How do I add a playlist?",
    answer: "Log in to the User Panel with your Device ID and PIN, go to the Playlists tab, and enter a name along with the playlist URL. Your playlist will be synced to your device automatically."
  },
  {
    question: "Is there EPG (Electronic Program Guide) support?",
    answer: "Yes, Nova Player supports EPG when your playlist provider includes EPG data or when you configure an EPG URL in the app settings."
  },
  {
    question: "What if my device ID changes?",
    answer: "If you reset your device or reinstall the app, a new Device ID may be generated. Contact support with your previous activation details for assistance."
  },
  {
    question: "How can I become a reseller?",
    answer: "Visit our 'Become a Reseller' page to learn about our reseller program. You'll get access to a special panel to manage customer activations and earn commissions."
  },
  {
    question: "Do you provide IPTV subscriptions?",
    answer: "No, Nova Player is only the player application. You need to obtain IPTV playlist subscriptions from your preferred IPTV provider separately."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach our support team through the Contact page on our website. We typically respond within 24-48 hours."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Got Questions?
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about Nova Player, activation, and features.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="glass-card border-border/30 px-6 rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-6 text-left font-display font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
