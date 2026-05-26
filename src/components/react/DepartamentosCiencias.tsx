import { useState } from "react";
import type { Departamento } from "@/types/departamento";

interface Props {
  departamentos: Departamento[];
}

export default function DepartamentosCiencias({ departamentos }: Props) {
  const [selectedId, setSelectedId] = useState<string>(departamentos[0]?.id ?? "");

  const selected = departamentos.find((d) => d.id === selectedId) ?? departamentos[0];

  return (
    <div className="mt-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Departamentos Académicos</h2>
        <p className="mt-2 text-sm text-gray-500">
          Selecciona un departamento para más información
        </p>
        <div className="mt-3 mx-auto w-14 h-1 rounded-full bg-[#1ba333]" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {departamentos.map((dept) => (
          <button
            key={dept.id}
            onClick={() => setSelectedId(dept.id)}
            className={[
              "flex flex-col items-center gap-3 p-5 rounded-xl border-2 text-center cursor-pointer transition-all duration-200",
              "hover:-translate-y-0.5 hover:shadow-md hover:border-[#1ba333]",
              selectedId === dept.id
                ? "border-[#1ba333] bg-[#e8f5eb] shadow-md"
                : "border-gray-200 bg-white",
            ].join(" ")}
          >
            {dept.logo ? (
              <img
                src={dept.logo}
                alt={dept.nombre}
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const sibling = target.nextElementSibling as HTMLElement | null;
                  if (sibling) sibling.style.display = "flex";
                }}
              />
            ) : null}
            <Placeholder text={dept.placeholder} hidden={!!dept.logo} />
            <span
              className={[
                "text-xs font-semibold leading-tight",
                selectedId === dept.id ? "text-[#145c24]" : "text-gray-600",
              ].join(" ")}
            >
              {dept.nombre}
            </span>
            <span
              className={[
                "w-2 h-2 rounded-full bg-[#1ba333] transition-opacity",
                selectedId === dept.id ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
          </button>
        ))}
      </div>

      {selected && (
        <div
          key={selected.id}
          className="mt-5 border-2 border-[#1ba333] rounded-2xl bg-white p-8 flex flex-col sm:flex-row gap-8 items-center shadow-lg"
          style={{ animation: "fadeSlideIn 0.25s ease" }}
        >
          <div className="shrink-0 flex items-center justify-center">
            {selected.logo ? (
              <img
                src={selected.logo}
                alt={selected.nombre}
                className="w-32 h-32 object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const sibling = target.nextElementSibling as HTMLElement | null;
                  if (sibling) sibling.style.display = "flex";
                }}
              />
            ) : null}
            <Placeholder text={selected.placeholder} hidden={!!selected.logo} large />
          </div>
          <div>
            <span className="inline-block bg-[#e8f5eb] text-[#145c24] border border-[#1ba333] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              Departamento Académico
            </span>
            <h3 className="text-xl font-bold text-[#145c24] mb-3">{selected.nombre}</h3>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
              {selected.descripcion}
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <span className="flex items-center gap-1.5 text-xs bg-gray-100 border border-gray-200 text-gray-400 px-3 py-1 rounded-full">
                <svg className="w-3 h-3 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="7" r="4" />
                  <path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
                </svg>
                Planta docente próximamente
              </span>
              <span className="flex items-center gap-1.5 text-xs bg-gray-100 border border-gray-200 text-gray-400 px-3 py-1 rounded-full">
                <svg className="w-3 h-3 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Actividades próximamente
              </span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

interface PlaceholderProps {
  text: string;
  hidden: boolean;
  large?: boolean;
}

function Placeholder({ text, hidden, large = false }: PlaceholderProps) {
  return (
    <div
      className={[
        "rounded-full flex items-center justify-center font-bold text-white",
        "bg-gradient-to-br from-[#1ba333] to-[#145c24]",
        large ? "w-32 h-32 text-4xl" : "w-16 h-16 text-xl",
        hidden ? "hidden" : "flex",
      ].join(" ")}
    >
      {text}
    </div>
  );
}
