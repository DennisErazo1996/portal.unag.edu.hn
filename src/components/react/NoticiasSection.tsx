import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';

const translations = {
  es: {
    badge: "Blog UNAG",
    title: "Últimas Noticias",
    subtitle: "Manténte al día con las últimas novedades y eventos de nuestra comunidad universitaria",
    readMore: "Leer más",
    viewAll: "Ver todas las noticias",
    errorLoading: "Error al cargar las noticias",
    unknownError: "Error desconocido"
  },
  en: {
    badge: "UNAG Blog",
    title: "Latest News",
    subtitle: "Stay up to date with the latest news and events from our university community",
    readMore: "Read more",
    viewAll: "View all news",
    errorLoading: "Error loading news",
    unknownError: "Unknown error"
  }
};

const STRAPI_BASE = 'https://posts.unag.edu.hn';
const BLOG_BASE = 'https://blog.unag.edu.hn';
const FALLBACK_IMAGE = 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg';

interface StrapiImage {
  url: string;
  formats?: {
    small?: { url: string };
    thumbnail?: { url: string };
  };
}

interface StrapiPost {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  date: string | null;
  author: string | null;
  image: StrapiImage | null;
}

interface Noticia {
  title: string;
  date: string | null;
  link: string;
  imageUrl: string;
}

function resolveImageUrl(image: StrapiImage | null): string {
  if (!image) return FALLBACK_IMAGE;
  const path = image.formats?.small?.url || image.formats?.thumbnail?.url || image.url;
  if (!path) return FALLBACK_IMAGE;
  return path.startsWith('http') ? path : `${STRAPI_BASE}${path}`;
}

export default function NoticiasSection() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const t = translations[lang];

  useEffect(() => {
    const currentPath = window.location.pathname;
    const detectedLang = currentPath.startsWith('/en/') || currentPath === '/en' ? 'en' : 'es';
    setLang(detectedLang);
  }, []);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const response = await fetch(
          `${STRAPI_BASE}/api/posts?populate=image&pagination[limit]=6&sort=date:desc`
        );

        if (!response.ok) {
          throw new Error(t.errorLoading);
        }

        const json = await response.json();
        const posts: StrapiPost[] = json.data || [];

        setNoticias(
          posts.map((post) => ({
            title: post.title,
            date: post.date,
            link: `${BLOG_BASE}/posts/${post.slug}`,
            imageUrl: resolveImageUrl(post.image),
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : t.unknownError);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = lang === 'en' ? 'en-US' : 'es-HN';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-20 dark:bg-background text-[12px]">
        <div className="container mx-auto px-4">
          {/* Encabezado Skeleton */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gray-200 dark:bg-unag-dark-green rounded animate-pulse"></div>
              <div className="w-24 h-4 bg-gray-200 dark:bg-unag-dark-green rounded animate-pulse"></div>
            </div>
            <div className="w-64 h-10 bg-gray-200 dark:bg-unag-dark-green rounded mx-auto mb-3 animate-pulse"></div>
            <div className="w-40 h-6 bg-gray-200 dark:bg-unag-dark-green rounded mx-auto animate-pulse"></div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-unag-dark-green rounded-2xl overflow-hidden shadow-lg"
              >
                {/* Imagen Skeleton */}
                <div className="h-48 bg-gray-200 dark:bg-g animate-pulse"></div>
                
                {/* Contenido Skeleton */}
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 dark:bg-background rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-200 dark:bg-background rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-background rounded w-1/2 animate-pulse mt-4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botón Skeleton */}
          <div className="text-center">
            <div className="inline-block w-56 h-12 bg-gray-200 dark:bg-unag-dark-green rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Newspaper className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="lg:py-15 dark:bg-background text-[12px] scale-90">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Newspaper className="w-6 h-6 text-unag-green" />
            <p className="text-sm text-gray-600 dark:text-white uppercase tracking-wide">{t.badge}</p>
          </div>
          <h2 className="text-4xl font-bold text-unag-dark-green dark:text-unag-green mb-3">
            {t.title}
          </h2>
          <p className="text-gray-600 dark:text-white text-sm max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Grid de Noticias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {noticias.map((noticia, index) => (
            <a
              key={index}
              href={noticia.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white dark:bg-unag-dark-green rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Imagen */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={noticia.imageUrl || 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg'}
                  alt={noticia.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-unag-green text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6 bg-unag-dark-green flex flex-col">
                <h3 
                  className="text-lg font-bold text-white mb-2 line-clamp-2 transition-colors capitalize min-h-[3.5rem]"
                  dangerouslySetInnerHTML={{ __html: noticia.title }}
                />
                <p className="text-gray-300 text-xs mb-3">
                  {noticia.date ? formatDate(noticia.date) : ''}
                </p>
                <div className="flex items-center gap-2 text-sm text-unag-green font-medium mt-auto">
                  <span>{t.readMore}</span>
                  <svg 
                    className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Botón Ver Todas */}
        <div className="text-center">
          <a
            href={BLOG_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-unag-green hover:bg-unag-dark-green text-white font-semibold px-8 py-3 rounded-full transition-colors duration-300 group"
          >
            {t.viewAll}
            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
