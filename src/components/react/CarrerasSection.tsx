import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

import carreras from "@/consts/carreras";
import stats from "@/consts/estadisticas";

const translations = {
  es: {
    badge: "Oferta Académica",
    title: "NUESTRAS CARRERAS DE GRADO",
    description: "8 carreras de grado diseñadas para formar líderes en el sector agrícola y agroindustrial del país.",
    prevPage: "Página anterior",
    nextPage: "Página siguiente",
    viewMore: "Ver más",
    statsLabels: {
      "Estudiantes": "Estudiantes",
      "Egresados": "Egresados",
      "Centros Regionales": "Centros Regionales",
      "Docentes y Personal": "Docentes y Personal"
    }
  },
  en: {
    badge: "Academic Offerings",
    title: "OUR UNDERGRADUATE PROGRAMS",
    description: "8 undergraduate programs designed to train leaders in the country's agricultural and agro-industrial sector.",
    prevPage: "Previous page",
    nextPage: "Next page",
    viewMore: "View more",
    statsLabels: {
      "Estudiantes": "Students",
      "Egresados": "Graduates",
      "Centros Regionales": "Regional Centers",
      "Docentes y Personal": "Faculty and Staff"
    }
  }
};




function useCountUp(end: number, duration: number = 2000, isVisible: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * (end - startValue) + startValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return count;
}

export default function CarrerasSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const statsRef = useRef<HTMLDivElement>(null);
  const carrerasPerPage = 3;
  const totalPages = Math.ceil(carreras.length / carrerasPerPage);
  const t = translations[lang];

  // Detect language from URL
  useEffect(() => {
    const currentPath = window.location.pathname;
    const detectedLang = currentPath.startsWith('/en/') || currentPath === '/en' ? 'en' : 'es';
    setLang(detectedLang);
  }, []);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isStatsVisible) {
            setIsStatsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [isStatsVisible]);

  const handleSlide = (pageIndex: number) => {
    if (isAnimating || pageIndex === currentPage) return;
    setIsAnimating(true);
    setCurrentPage(pageIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    const newPage = currentPage === 0 ? totalPages - 1 : currentPage - 1;
    handleSlide(newPage);
  };

  const handleNext = () => {
    const newPage = currentPage === totalPages - 1 ? 0 : currentPage + 1;
    handleSlide(newPage);
  };

  
  const startIndex = currentPage * carrerasPerPage;
  const visibleCarreras = carreras.slice(startIndex, startIndex + carrerasPerPage);

  return (
    <section className="dark:bg-background text-green-900 lg:py-20 lg:mb-20">
      {/* Encabezado */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="inline-flex items-center gap-2 bg-unag-green/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
					<div className="w-2 h-2 bg-unag-green rounded-full animate-pulse"></div>
					<p className="text-sm font-semibold text-unag-dark-green dark:text-white">{t.badge}</p>
				</div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 dark:text-unag-green mb-2 leading-none">
          {t.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-white mb-8 w-full leading-none">
          {t.description}
        </p>

        {/* Carrusel */}
        <div className="relative">
          
          <button
            onClick={handlePrev}
            disabled={isAnimating}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-5 bg-white hover:bg-green-50 rounded-full p-3 shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 hidden md:block"
            aria-label={t.prevPage}
          >
            <ChevronLeft size={24} className="text-green-900" />
          </button>

          
          <button
            onClick={handleNext}
            disabled={isAnimating}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-5 bg-white hover:bg-green-50 rounded-full p-3 shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 hidden md:block"
            aria-label={t.nextPage}
          >
            <ChevronRight size={24} className="text-green-900" />
          </button>

          <div className=" relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {visibleCarreras.map((carrera, i) => (
                <div 
                  key={`${currentPage}-${i}`} 
                  className="opacity-0 animate-fadeInUp"
                  style={{ 
                    animationDelay: `${i * 150}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <div className="bg-green-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-2">
                    <div className="relative group">
                      <img
                        src={carrera.imagen}
                        alt={carrera.nombre}
                        className="h-48 w-full object-cover transition-transform group-hover:scale-110"
                      />
                      <a
                        href={carrera.link}
                        target="_blank"
                        className="absolute bottom-0 left-0 right-0 bg-green-800 dark:bg-unag-dark-green text-white px-4 py-3 flex items-center justify-between hover:bg-green-700 transition-colors"
                      >
                        <span className="font-semibold text-[12px]">
                          {carrera.nombre}
                        </span>
                        <div className="p-1 bg-unag-dark-green dark:bg-unag-green rounded-full">
                            <ArrowUpRight size={18} className="flex-shrink-0" />
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicadores */}
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSlide(i)}
                  disabled={isAnimating}
                  className={`h-2.5 rounded-full transition-all ${
                    currentPage === i ? "bg-green-600 w-8" : "bg-gray-300 w-2.5 hover:bg-gray-400"
                  }`}
                  aria-label={`Ir a página ${i + 1}`}
                ></button>
              ))}
            </div>

            {/* Botones móviles */}
            <div className="flex md:hidden justify-center gap-4 mt-4">
              <button
                onClick={handlePrev}
                disabled={isAnimating}
                className="bg-green-800 hover:bg-green-700 text-white rounded-full p-3 shadow-md transition-all disabled:opacity-50"
                aria-label="Página anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                disabled={isAnimating}
                className="bg-green-800 hover:bg-green-700 text-white rounded-full p-3 shadow-md transition-all disabled:opacity-50"
                aria-label="Página siguiente"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de estadísticas */}
      <div ref={statsRef} className="bg-unag-dark-green py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((item, i) => (
            <StatCard 
              key={i} 
              item={item} 
              index={i} 
              isVisible={isStatsVisible}
              lang={lang}
              translations={t.statsLabels}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


function StatCard({ item, index, isVisible, lang, translations }: { 
  item: { valor: number; etiqueta: string; prefijo: string }; 
  index: number;
  isVisible: boolean;
  lang: 'es' | 'en';
  translations: Record<string, string>;
}) {
  const animatedValue = useCountUp(item.valor, 2000, isVisible);
  const translatedLabel = translations[item.etiqueta] || item.etiqueta;
  
  return (
    <div
      className={`rounded-2xl p-6 text-center flex flex-col justify-center items-center transition-all duration-500 ${
        index % 2 === 0 ? "bg-green-700 dark:bg-background" : "bg-green-600 dark:bg-background"
      } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <ArrowUpRight size={18} className="text-white mb-2 dark:text-white" />
      <p className="text-2xl md:text-3xl font-bold text-white tabular-nums dark:text-white">
        {item.prefijo}{animatedValue.toLocaleString()}
      </p>
      <p className="text-sm md:text-base text-white/90 dark:text-white">
        {translatedLabel}
      </p>
    </div>
  );
}
