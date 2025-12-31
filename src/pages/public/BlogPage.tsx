import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const blogPosts = [
  {
    key: "b1",
    slug: "getting-started-nova-player",
    date: "December 25, 2024",
    readTime: 5,
    categoryKey: "tutorial",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format"
  },
  {
    key: "b2",
    slug: "best-practices-playlist-management",
    date: "December 20, 2024",
    readTime: 4,
    categoryKey: "tips",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format"
  },
  {
    key: "b3",
    slug: "optimizing-streaming-quality",
    date: "December 15, 2024",
    readTime: 6,
    categoryKey: "guide",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format"
  },
  {
    key: "b4",
    slug: "epg-setup-guide",
    date: "December 10, 2024",
    readTime: 3,
    categoryKey: "tutorial",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format"
  }
];

export default function BlogPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            {t("blog.badge")}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {t("blog.title")} <span className="gradient-text">{t("blog.titleHighlight")}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("blog.description")}
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
                  alt={t(`blog.items.${post.key}.title`)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {t(`blog.categories.${post.categoryKey}`)}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Clock className="w-3 h-3" />
                    {post.readTime} {t("blog.minRead")}
                  </span>
                </div>
                <h2 className="font-display font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                  {t(`blog.items.${post.key}.title`)}
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  {t(`blog.items.${post.key}.excerpt`)}
                </p>
                <span className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                  {t("blog.readMore")} <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
