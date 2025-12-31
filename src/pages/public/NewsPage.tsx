import { Newspaper, Calendar } from "lucide-react";

const newsItems = [
  {
    date: "December 28, 2024",
    title: "Nova Player 2.5 Released",
    excerpt: "New version brings improved performance, better EPG support, and a redesigned channel guide. Update now for the best experience.",
    category: "Release"
  },
  {
    date: "December 15, 2024",
    title: "Fire TV Stick Support Enhanced",
    excerpt: "Optimized navigation and remote control support for Amazon Fire TV devices. Enjoy smoother browsing with your Fire TV remote.",
    category: "Update"
  },
  {
    date: "December 1, 2024",
    title: "New Reseller Program Launch",
    excerpt: "Introducing our updated reseller program with better commissions and a dedicated reseller panel. Apply today!",
    category: "Announcement"
  },
  {
    date: "November 20, 2024",
    title: "Server Infrastructure Upgrade",
    excerpt: "We've upgraded our servers for faster playlist loading and improved reliability. Experience zero downtime streaming.",
    category: "Infrastructure"
  },
  {
    date: "November 10, 2024",
    title: "Multi-Audio Track Support",
    excerpt: "Nova Player now supports multiple audio tracks. Switch between languages on the fly for channels that offer multiple audio options.",
    category: "Feature"
  }
];

export default function NewsPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Newspaper className="w-4 h-4" />
            Stay Updated
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Latest <span className="gradient-text">News</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay informed about the latest updates, features, and announcements from Nova Player.
          </p>
        </div>

        {/* News Grid */}
        <div className="max-w-4xl mx-auto space-y-6">
          {newsItems.map((item, index) => (
            <article 
              key={index}
              className="glass-card p-6 hover-glow transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="hidden sm:block w-20 h-20 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <Newspaper className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                  <h2 className="font-display font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {item.excerpt}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
