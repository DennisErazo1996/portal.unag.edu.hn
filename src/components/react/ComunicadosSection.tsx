import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ArrowUpRight, MoveRight } from "lucide-react";

const translations = {
  es: {
    badge: "Últimas publicaciones",
    title: "COMUNICADOS",
    viewAll: "Ver todos los comunicados",
    goToPage: "Ir a página",
    categories: {
      "Convocatorias": "Convocatorias",
      "Avisos": "Avisos",
      "Noticias": "Noticias",
      "Eventos": "Eventos",
      "Académico": "Académico",
      "Administrativo": "Administrativo"
    }
  },
  en: {
    badge: "Latest Publications",
    title: "ANNOUNCEMENTS",
    viewAll: "View all announcements",
    goToPage: "Go to page",
    categories: {
      "Convocatorias": "Calls",
      "Avisos": "Notices",
      "Noticias": "News",
      "Eventos": "Events",
      "Académico": "Academic",
      "Administrativo": "Administrative"
    }
  }
};

interface Comunicado {
  id: string;
  data: {
    title: string;
    description: string;
    category: string;
    date: Date;
    featured: boolean;
    image?: string;
  };
}

interface ComunicadosSectionProps {
  comunicados: Comunicado[];
}

export default function ComunicadosSection({
  comunicados,
}: ComunicadosSectionProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const t = translations[lang];

  // Detect language from URL
  useEffect(() => {
    const currentPath = window.location.pathname;
    const detectedLang = currentPath.startsWith('/en/') || currentPath === '/en' ? 'en' : 'es';
    setLang(detectedLang);
  }, []);

  const formatDate = (date: Date) => {
    const locale = lang === 'en' ? 'en-US' : 'es-HN';
    return new Date(date).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  const translateCategory = (category: string): string => {
    return t.categories[category as keyof typeof t.categories] || category;
  };

  return (
    <section id="comunicados" className="py-30 bg-unag-light-gray/50 dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-unag-green/10 dark:bg-unag-green/30 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <div className="w-2 h-2 bg-unag-green rounded-full animate-pulse"></div>
              <p className="text-sm font-semibold light:text-unag-dark-green dark:text-white">
                {t.badge}
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-unag-dark-green dark:text-unag-green mb-6">
              {t.title}
            </h2>
          </div>
          <div className="hover:bg-unag-dark-green dark:hover:bg-unag-green hover:text-white px-4 py-2 hover:rounded-full transition-all duration-300">
            <a
              href={lang === 'en' ? '/en/comunicados' : '/comunicados'}
              className="hidden md:flex items-center gap-2 hover:text-white transition-colors text-unag-dark-green dark:text-white group"
            >
              {t.viewAll}
              <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        <Swiper
          modules={[Pagination]}
          spaceBetween={16}
          slidesPerView={1}
          slidesPerGroup={1}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
            renderBullet: (index, className) => {
              return `<button class="${className}" aria-label="${t.goToPage} ${index + 1}"></button>`;
            },
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },
            768: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },
            1024: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
          }}
          onSwiper={setSwiperInstance}
          className="comunicados-swiper"
        >
          {comunicados.map((comunicado) => (
            <SwiperSlide key={comunicado.id}>
              <a
                href={lang === 'en' ? `/en/comunicados/${comunicado.id}` : `/comunicados/${comunicado.id}`}
                className="block bg-unag-dark-green rounded-3xl h-[280px]"
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={` text-unag-dark-green bg-unag-light-green font-extrabold text-xs font-semibold px-3 py-1 rounded-full`}
                    >
                      {translateCategory(comunicado.data.category)}
                    </span>
                    <div className="bg-unag-green p-2 rounded-full">
                      <ArrowUpRight className="w-5 h-5 text-white group-hover:text-unag-light-green transition-colors" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-unag-light-green transition-colors">
                    {comunicado.data.title}
                  </h3>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-4 flex-grow">
                    {comunicado.data.description}
                  </p>

                  <div className="text-white italic text-sm font-medium mt-auto">
                    {formatDate(comunicado.data.date)}
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

        <a
          href={lang === 'en' ? '/en/comunicados' : '/comunicados'}
          className="md:hidden flex items-center justify-center gap-2 text-unag-dark-green hover:text-unag-light-green transition-colors group mt-8"
        >
          {t.viewAll}
          <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      <style>{`
        .comunicados-swiper {
          padding-bottom: 3rem;
        }

        .comunicados-swiper .swiper-pagination {
          bottom: 0;
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }

        .comunicados-swiper .swiper-pagination-bullet {
          width: 0.5rem;
          height: 0.5rem;
          background-color: #4b5563;
          opacity: 1;
          border-radius: 9999px;
          transition: all 0.3s;
          cursor: pointer;
          border: none;
        }

        .comunicados-swiper .swiper-pagination-bullet:hover {
          background-color: #6b7280;
        }

        .comunicados-swiper .swiper-pagination-bullet-active {
          width: 2.5rem;
          background-color: #1ba333;
        }
      `}</style>
    </section>
  );
}
