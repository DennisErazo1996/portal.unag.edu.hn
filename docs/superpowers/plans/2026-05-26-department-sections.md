# Department Sections — Facultad de Ciencias Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an interactive 5-card department grid to the Facultad de Ciencias page, where each card shows a department logo and clicking it reveals a panel with logo + description.

**Architecture:** Add a `Departamento` type, a `departamentosCiencias` data constant, a React component (`DepartamentosCiencias.tsx`) for the interactive card+panel UI, and update the Astro page to render it.

**Tech Stack:** Astro 6, React 19, Tailwind 4, TypeScript

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/types/departamento.ts` | `Departamento` type |
| Modify | `src/consts/facultades/docentes-facultad-de-ciencias.ts` | Add `departamentosCiencias` export |
| Create | `src/components/react/DepartamentosCiencias.tsx` | Interactive card grid + detail panel |
| Modify | `src/pages/organizacion/facultades/facultad-de-ciencias.astro` | Render new component, keep decana/secretaria cards |

---

### Task 1: Create the `Departamento` type

**Files:**
- Create: `src/types/departamento.ts`

- [ ] **Step 1: Create the type file**

```typescript
// src/types/departamento.ts
export type Departamento = {
  id: string;
  nombre: string;
  logo: string | null;      // null = use placeholder
  placeholder: string;      // 2-letter initials fallback
  descripcion: string;
};
```

- [ ] **Step 2: Commit**

```bash
git add src/types/departamento.ts
git commit -m "feat: add Departamento type"
```

---

### Task 2: Add `departamentosCiencias` data constant

**Files:**
- Modify: `src/consts/facultades/docentes-facultad-de-ciencias.ts`

- [ ] **Step 1: Add import at the top of the file**

The top of the file should read:

```typescript
import type { Docente } from "@/types/docente";
import type { Departamento } from "@/types/departamento";
```

- [ ] **Step 2: Add the new export at the bottom of the file (after the existing `export default`)**

```typescript
export const departamentosCiencias: Departamento[] = [
  {
    id: "biologia",
    nombre: "Biología y Microbiología",
    logo: "/img/facultades/facultad-ciencias/microbiologia-unag.png",
    placeholder: "BM",
    descripcion:
      "Departamento dedicado al estudio de los seres vivos, los microorganismos y sus interacciones con el entorno. Forma profesionales con sólidas bases en ciencias biológicas orientadas a la investigación y la salud.",
  },
  {
    id: "quimica",
    nombre: "Química",
    logo: "/img/facultades/facultad-ciencias/depto-quimica.png",
    placeholder: "Q",
    descripcion:
      "Departamento enfocado en el estudio de la materia, sus propiedades, composición y transformaciones. Ofrece formación teórica y práctica en química general, analítica y aplicada.",
  },
  {
    id: "damfi",
    nombre: "Matemática, Física e Informática",
    logo: "/img/facultades/facultad-ciencias/damfi-unag.png",
    placeholder: "MFI",
    descripcion:
      "Departamento que integra las ciencias exactas con la tecnología de la información. Promueve el pensamiento lógico-matemático y el desarrollo de competencias computacionales en sus estudiantes.",
  },
  {
    id: "letras",
    nombre: "Letras y Lenguas",
    logo: "/img/facultades/facultad-ciencias/depto-letras.png",
    placeholder: "LL",
    descripcion:
      "Departamento comprometido con el estudio del lenguaje, la literatura y las ciencias de la comunicación. Cultiva la expresión oral y escrita, la investigación lingüística y la apreciación literaria.",
  },
  {
    id: "sociales",
    nombre: "Sociales y Humanidades",
    logo: null,
    placeholder: "SH",
    descripcion:
      "Departamento orientado al análisis crítico de la sociedad, la historia y la cultura. Forma profesionales con visión humanista capaces de comprender y transformar su entorno social.",
  },
];
```

- [ ] **Step 3: Commit**

```bash
git add src/consts/facultades/docentes-facultad-de-ciencias.ts
git commit -m "feat: add departamentosCiencias data constant"
```

---

### Task 3: Create the `DepartamentosCiencias` React component

**Files:**
- Create: `src/components/react/DepartamentosCiencias.tsx`

- [ ] **Step 1: Create the component file**

```tsx
// src/components/react/DepartamentosCiencias.tsx
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
      {/* Section heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Departamentos Académicos</h2>
        <p className="mt-2 text-sm text-gray-500">
          Selecciona un departamento para más información
        </p>
        <div className="mt-3 mx-auto w-14 h-1 rounded-full bg-[#1ba333]" />
      </div>

      {/* Card grid */}
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

      {/* Detail panel */}
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
```

- [ ] **Step 2: Verify TypeScript has no errors**

```bash
npx tsc --noEmit
```

Expected: no errors related to `DepartamentosCiencias.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/react/DepartamentosCiencias.tsx
git commit -m "feat: add DepartamentosCiencias interactive component"
```

---

### Task 4: Update the Facultad de Ciencias Astro page

**Files:**
- Modify: `src/pages/organizacion/facultades/facultad-de-ciencias.astro`

- [ ] **Step 1: Replace the frontmatter imports and script block**

Replace the top `---` block (lines 1–18) with:

```astro
---
export const prerender = true;

import Layout from "@/layouts/main.astro";
import DocenteCard from "@/components/astro/ui/docente-card.astro";
import HeaderFacultad from "@/components/astro/ui/header-facultad.astro";
import DepartamentosCiencias from "@/components/react/DepartamentosCiencias.tsx";

import docentesFacultadCiencias, { departamentosCiencias } from "@/consts/facultades/docentes-facultad-de-ciencias.ts";

const content = {
  title: "Facultad de Ciencias | UNAG",
};

const decana = docentesFacultadCiencias[0];
const secretaria = docentesFacultadCiencias[1];
---
```

- [ ] **Step 2: Replace the Personal section (from `<h1 class="font-bold">Personal:</h1>` to end of `</section>`)**

Replace that block with:

```astro
    <!-- Decana y Secretaria -->
    <h1 class="font-bold mb-4">Personal:</h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4">
      <DocenteCard
        nombreCompleto={decana.nombreCompleto}
        nombre={decana.nombre}
        apellido={decana.apellido}
        cargo={decana.cargo}
        grado={decana.grado}
        area={decana.area}
        correo={decana.correo}
      />
      <DocenteCard
        nombreCompleto={secretaria.nombreCompleto}
        nombre={secretaria.nombre}
        apellido={secretaria.apellido}
        cargo={secretaria.cargo}
        grado={secretaria.grado}
        area={secretaria.area}
        correo={secretaria.correo}
      />
    </div>

    <!-- Departamentos -->
    <DepartamentosCiencias
      client:load
      departamentos={departamentosCiencias}
    />
  </section>
</Layout>
```

- [ ] **Step 3: Run the dev server and verify visually**

```bash
npm run dev
```

Open `http://localhost:4321/organizacion/facultades/facultad-de-ciencias` in a browser.

Expected:
- Page loads without errors
- Decana and Secretaria cards appear side-by-side at the top of the Personal section
- 5 department cards appear below in a grid (5 cols desktop, 3 cols tablet, 2 cols mobile)
- First card (Biología y Microbiología) is selected by default with green border
- Clicking each card shows logo + description in the panel below
- Sociales y Humanidades shows "SH" green circle placeholder (no logo)
- "Planta docente próximamente" and "Actividades próximamente" chips are visible in panel

- [ ] **Step 4: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Final commit**

```bash
git add src/pages/organizacion/facultades/facultad-de-ciencias.astro
git commit -m "feat: add department sections to Facultad de Ciencias page

Replaces flat docentes grid with interactive 5-card department grid.
Each card shows department logo (or placeholder) and clicking reveals
a detail panel with logo, description, and coming-soon chips for
future teacher/activity data.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```
