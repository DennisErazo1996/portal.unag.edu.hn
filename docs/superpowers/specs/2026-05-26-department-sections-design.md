# Departamentos Académicos — Facultad de Ciencias

**Date:** 2026-05-26  
**Status:** Approved  
**Page:** `/organizacion/facultades/facultad-de-ciencias`

---

## Overview

Replace the current flat list of docentes on the Facultad de Ciencias page with a 5-card grid where each card represents an academic department. Clicking a card reveals a detail panel below showing the department logo and a short description. This layout is designed to work with incomplete data (no full teacher list or activities yet) and will be expandable in the future.

---

## Layout

**Grid of 5 cards + expandable panel below** (Option B from brainstorming).

- 5 cards in a horizontal grid (5 columns desktop / 2-3 tablet / 1-2 mobile)
- Each card: department logo (or placeholder initials) + department name
- Selecting a card highlights it with green border and expands a panel below
- Panel contains: large logo, department name badge, short description, "coming soon" chips for teachers and activities

---

## Departments & Assets

| Department | Logo file | Placeholder |
|---|---|---|
| Biología y Microbiología | `microbiologia-unag.png` | — |
| Química | `depto-quimica.png` | — |
| Matemática, Física e Informática | `damfi-unag.png` | — |
| Letras y Lenguas | `depto-letras.png` | — |
| Sociales y Humanidades | *(no logo)* | "SH" initials on green circle |

Logos path: `public/img/facultades/facultad-ciencias/`

---

## Data Structure

Add a `departamentos` constant in `src/consts/facultades/docentes-facultad-de-ciencias.ts` (or a new file):

```ts
export const departamentosCiencias = [
  {
    id: 'biologia',
    nombre: 'Biología y Microbiología',
    logo: '/img/facultades/facultad-ciencias/microbiologia-unag.png',
    descripcion: 'Departamento dedicado al estudio de los seres vivos...',
    jefe: 'Douglas Domingo Flores', // from existing docentes data
  },
  // ... 4 more
]
```

The existing `docentesFacultadCiencias` flat array remains unchanged for now (the decana and secretary cards stay on the page above the departments section).

---

## Components

### New: `DepartamentosCiencias.astro` (or `.tsx` if interactivity needed)

Since the card selection/panel toggle requires client-side interaction, implement as a **React component** (`DepartamentosCiencias.tsx`) with `client:load` directive in the Astro page.

Props: receives the `departamentos` array.

Internal state: `selectedId: string | null` — tracks which card is active.

---

## Design Tokens

- Active card border: `border-[#1ba333]` / `bg-[#e8f5eb]`
- Panel border: `border-2 border-[#1ba333]`
- Badge: green light background, uppercase text
- Placeholder circle: `bg-gradient-to-br from-[#1ba333] to-[#145c24]`
- "Coming soon" chips: gray background, gray text, small icons
- Transition: `transition-all duration-200` on cards

---

## Page Changes

`facultad-de-ciencias.astro`:
1. Keep the existing header (`HeaderFacultad`) and decana/secretary cards unchanged above
2. Add a section heading "Departamentos Académicos" with green underline divider
3. Render `<DepartamentosCiencias client:load departamentos={departamentosCiencias} />`

---

## Future Expandability

When teachers and activities data become available:
- Add `docentes: Docente[]` and `actividades: Actividad[]` arrays to each department object
- The detail panel renders them inside the same component (no layout change needed)
- Remove "coming soon" chips when data is present
