import { Newspaper, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

const newsItems = [
  { key: "n1", categoryKey: "release" },
  { key: "n2", categoryKey: "update" },
  { key: "n3", categoryKey: "announcement" },
  { key: "n4", categoryKey: "infrastructure" },
  { key: "n5", categoryKey: "feature" }
];

export default function NewsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Newspaper className="w-4 h-4" />
            {t("news.badge")}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {t("news.title")} <span className="gradient-text">{t("news.titleHighlight")}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("news.description")}
          </p>
        </div>

        {/* News Grid */}
        <div className="max-w-4xl mx-auto space-y-6">
          {newsItems.map((item) => (
            <article 
              key={item.key}
              className="glass-card p-6 hover-glow transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="hidden sm:block w-20 h-20 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <Newspaper className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {t(`news.categories.${item.categoryKey}`)}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Calendar className="w-3 h-3" />
                      {t(`news.items.${item.key}.date`)}
                    </span>
                  </div>
                  <h2 className="font-display font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                    {t(`news.items.${item.key}.title`)}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {t(`news.items.${item.key}.excerpt`)}
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
