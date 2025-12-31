import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    slug: "getting-started-nova-player",
    date: "December 25, 2024",
    readTime: "5 min read",
    title: "Getting Started with Nova Player: A Complete Guide",
    excerpt: "Learn how to set up Nova Player on your device, add your first playlist, and start streaming in minutes.",
    category: "Tutorial",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format"
  },
  {
    slug: "best-practices-playlist-management",
    date: "December 20, 2024",
    readTime: "4 min read",
    title: "Best Practices for Playlist Management",
    excerpt: "Organize your playlists effectively with these tips and tricks for managing multiple M3U sources.",
    category: "Tips",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format"
  },
  {
    slug: "optimizing-streaming-quality",
    date: "December 15, 2024",
    readTime: "6 min read",
    title: "Optimizing Your Streaming Quality",
    excerpt: "Get the best picture quality with our guide to video settings, buffer optimization, and network configuration.",
    category: "Guide",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format"
  },
  {
    slug: "epg-setup-guide",
    date: "December 10, 2024",
    readTime: "3 min read",
    title: "How to Set Up EPG (Electronic Program Guide)",
    excerpt: "Configure your electronic program guide to see what's playing now and schedule your viewing.",
    category: "Tutorial",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Learn & Explore
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Nova Player <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tutorials, tips, and guides to help you get the most out of Nova Player.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <article 
              key={post.slug}
              className="glass-card overflow-hidden hover-glow transition-all duration-300 group cursor-pointer"
            >
              <div className="aspect-video bg-secondary overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                <h2 className="font-display font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                  Read More <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
