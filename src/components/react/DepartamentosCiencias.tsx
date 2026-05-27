import { useState } from "react";
import type { Departamento } from "@/types/departamento";

interface Props {
  departamentos: Departamento[];
}

export default function DepartamentosCiencias({ departamentos }: Props) {
  const [selectedId, setSelectedId] = useState<string>(departamentos[0]?.id ?? "");

  const selected = departamentos.find((d) => d.id === selectedId) ?? departamentos[0];

  return (
    <div className="mt-14">
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-1 h-10 bg-unag-green shrink-0" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-unag-green mb-0.5">
            Facultad de Ciencias
          </p>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-none">
            Departamentos Académicos
          </h2>
        </div>
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {departamentos.map((dept, i) => {
          const isActive = selectedId === dept.id;
          return (
            <button
              key={dept.id}
              onClick={() => setSelectedId(dept.id)}
              style={{ animationDelay: `${i * 60}ms` }}
              className={[
                "group relative flex flex-col items-center gap-4 p-5 text-center",
                "border-l-4 transition-all duration-200 outline-none",
                "focus-visible:ring-2 focus-visible:ring-unag-green focus-visible:ring-offset-2",
                isActive
                  ? "border-l-unag-green bg-unag-overlay-green dark:bg-unag-green/15 shadow-sm"
                  : "border-l-transparent bg-white dark:bg-unag-dark-green hover:border-l-unag-green hover:bg-unag-overlay-green/50 dark:hover:bg-unag-green/10",
              ].join(" ")}
            >
              {/* Marco de logo — proporción fija para uniformidad */}
              <div className={[
                "w-full flex items-center justify-center",
                "h-20 border",
                isActive
                  ? "border-unag-green/30 bg-white dark:bg-unag-dark-green/60"
                  : "border-gray-200 dark:border-unag-green/20 bg-white dark:bg-unag-dark-green/40",
              ].join(" ")}>
                {dept.logo ? (
                  <img
                    src={dept.logo}
                    alt={dept.nombre}
                    className="max-h-14 max-w-[80%] object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const sibling = target.nextElementSibling as HTMLElement | null;
                      if (sibling) sibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <PlaceholderInitials text={dept.placeholder} hidden={!!dept.logo} />
              </div>

              {/* Nombre */}
              <span className={[
                "text-[0.7rem] font-bold leading-snug uppercase tracking-wide",
                isActive
                  ? "text-unag-dark-green dark:text-unag-green"
                  : "text-gray-600 dark:text-white/80 group-hover:text-unag-dark-green dark:group-hover:text-white",
              ].join(" ")}>
                {dept.nombre}
              </span>

              {/* Indicador activo */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-unag-green" />
              )}
            </button>
          );
        })}
      </div>

      {/* Panel de detalle */}
      {selected && (
        <div
          key={selected.id}
          className="mt-0 border-l-4 border-l-unag-green bg-white dark:bg-unag-dark-green"
          style={{ animation: "panelIn 0.2s ease both" }}
        >
          <div className="flex flex-col sm:flex-row gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-unag-green/20">

            {/* Logo */}
            <div className="shrink-0 flex items-center justify-center p-8 sm:w-52">
              {selected.logo ? (
                <img
                  src={selected.logo}
                  alt={selected.nombre}
                  className="max-h-28 max-w-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const sibling = target.nextElementSibling as HTMLElement | null;
                    if (sibling) sibling.style.display = "flex";
                  }}
                />
              ) : null}
              <PlaceholderInitials text={selected.placeholder} hidden={!!selected.logo} large />
            </div>

            {/* Info */}
            <div className="flex-1 p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-unag-green border border-unag-green px-2 py-0.5">
                  Depto. Académico
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
                {selected.nombre}
              </h3>
              <p className="text-sm text-gray-500 dark:text-white/70 leading-relaxed max-w-xl">
                {selected.descripcion}
              </p>
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-100 dark:border-unag-green/20">
                <ComingSoonTag icon="person">Planta docente</ComingSoonTag>
                <ComingSoonTag icon="calendar">Actividades</ComingSoonTag>
              </div>
            </div>

          </div>
        </div>
      )}

      <style>{`
        @keyframes panelIn {
          from { opacity: 0; clip-path: inset(0 0 100% 0); }
          to   { opacity: 1; clip-path: inset(0 0 0% 0); }
        }
      `}</style>
    </div>
  );
}

function PlaceholderInitials({
  text,
  hidden,
  large = false,
}: {
  text: string;
  hidden: boolean;
  large?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-center font-extrabold text-white bg-unag-green",
        large ? "w-24 h-24 text-3xl" : "w-12 h-12 text-lg",
        hidden ? "hidden" : "flex",
      ].join(" ")}
    >
      {text}
    </div>
  );
}

function ComingSoonTag({
  icon,
  children,
}: {
  icon: "person" | "calendar";
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-wide text-gray-400 dark:text-white/40 border border-gray-200 dark:border-unag-green/20 px-2.5 py-1">
      {icon === "person" ? (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
        </svg>
      ) : (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )}
      {children}
      <span className="text-gray-300 dark:text-white/25 font-normal normal-case tracking-normal">— próximamente</span>
    </span>
  );
}
