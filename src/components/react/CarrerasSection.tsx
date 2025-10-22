import { useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

const carreras = [
  {
    nombre: "Medicina Veterinaria",
    imagen: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    link: "",
  },
  {
    nombre: "Ingeniería en Gestión Integral de los Recursos Naturales",
    imagen: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    link: "#",
  },
  {
    nombre: "Ingeniería en Recursos Naturales",
    imagen: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    link: "#",
  },
  {
    nombre: "Ingeniería en Alimentos",
    imagen: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    link: "#",
  },
  {
    nombre: "Ingeniería Forestal",
    imagen: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    link: "#",
  },
  {
    nombre: "Ingeniería en Administración de Empresas Agropecuarias",
    imagen: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    link: "#",
  },
  {
    nombre: "Ingeniería en Desarrollo Socioeconómico y Ambiente",
    imagen: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    link: "#",
  },
  {
    nombre: "Técnico en Producción Animal",
    imagen: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    link: "#",
  },
];

const stats = [
  { valor: "+3500", etiqueta: "Estudiantes" },
  { valor: "+3500", etiqueta: "Egresados" },
  { valor: "6", etiqueta: "Centros Regionales" },
  { valor: "+3500", etiqueta: "Docentes y Personal" },
];

export default function CarrerasSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carrerasPerPage = 3;
  const totalPages = Math.ceil(carreras.length / carrerasPerPage);

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

  // Obtener las carreras de la página actual
  const startIndex = currentPage * carrerasPerPage;
  const visibleCarreras = carreras.slice(startIndex, startIndex + carrerasPerPage);

  return (
    <section className="bg-white text-green-900 py-30">
      {/* Encabezado */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-sm text-gray-600">Oferta académica</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-6">
          NUESTRAS CARRERAS
        </h2>

        {/* Carrusel */}
        <div className="relative">
          {/* Botón Anterior */}
          <button
            onClick={handlePrev}
            disabled={isAnimating}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-green-50 rounded-full p-3 shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 hidden md:block"
            aria-label="Página anterior"
          >
            <ChevronLeft size={24} className="text-green-900" />
          </button>

          {/* Botón Siguiente */}
          <button
            onClick={handleNext}
            disabled={isAnimating}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-green-50 rounded-full p-3 shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 hidden md:block"
            aria-label="Página siguiente"
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
                        className="absolute bottom-0 left-0 right-0 bg-green-800 text-white px-4 py-3 flex items-center justify-between hover:bg-green-700 transition-colors"
                      >
                        <span className="font-semibold text-[12px]">
                          {carrera.nombre}
                        </span>
                        <div className="p-1 bg-unag-dark-green rounded-full">
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
      <div className="bg-unag-dark-green py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 text-center flex flex-col justify-center items-center ${
                i % 2 === 0 ? "bg-green-700" : "bg-green-600"
              }`}
            >
              <ArrowUpRight size={18} className="text-white mb-2" />
              <p className="text-2xl md:text-3xl font-bold text-white">
                {item.valor}
              </p>
              <p className="text-sm md:text-base text-white/90">
                {item.etiqueta}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
