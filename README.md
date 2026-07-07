# Portal UNAG

Sitio oficial de la **Universidad Nacional de Agricultura (UNAG)** — [unag.edu.hn](https://unag.edu.hn)

Construido con [Astro](https://astro.build) (modo server-side rendering) + React + Tailwind CSS.

## 🚀 Estructura del proyecto

```text
/
├── public/                  # Archivos estáticos (favicon, documentos, imágenes)
├── scripts/
│   └── index-content.mjs    # Indexa el contenido del sitio para el chatbot (se corre en prebuild)
├── src/
│   ├── assets/               # Imágenes optimizadas por Astro
│   ├── components/           # Componentes Astro y React
│   ├── content.config.ts     # Colecciones de contenido (Astro Content Collections)
│   ├── data/
│   │   └── site-content.md   # Contenido indexado usado por el chatbot (autogenerado)
│   ├── integrations/
│   │   └── auto-translate/   # Integración opcional de traducción automática
│   ├── layouts/               # Layouts base
│   └── pages/
│       ├── api/
│       │   ├── chat.ts               # Endpoint del chatbot institucional
│       │   └── comunicados.json.ts   # Endpoint JSON de comunicados
│       ├── acerca/, admisiones/, carreras/, organizacion/, comunicados/...
│       └── index.astro
└── package.json
```

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto, con [Bun](https://bun.sh):

| Comando         | Acción                                                           |
| :--------------- | :---------------------------------------------------------------- |
| `bun install`     | Instala dependencias                                             |
| `bun dev`         | Levanta el servidor de desarrollo en `localhost:4321`            |
| `bun run build`   | Indexa contenido (`prebuild`) y compila el sitio a `./dist/`     |
| `bun preview`     | Sirve la build de producción localmente                          |
| `bun run index`   | Regenera manualmente `src/data/site-content.md` para el chatbot  |
| `bun astro ...`   | Ejecuta comandos del CLI de Astro (`astro add`, `astro check`)   |

## ⚙️ Variables de entorno

Copiar `.env.example` a `.env` y completar según necesidad:

| Variable                | Descripción                                                            |
| :------------------------ | :------------------------------------------------------------------- |
| `OPENROUTER_API_KEY`      | Clave de [OpenRouter](https://openrouter.ai) usada por el chatbot (DeepSeek) |
| `GEMINI_API_KEY`          | Alternativa vía Google Gemini (opcional)                              |
| `OPENAI_API_KEY`          | Alternativa vía OpenAI; también requerida para traducción automática  |
| `ENABLE_AUTO_TRANSLATE`   | `true` para activar la integración de traducción automática           |

## 🤖 Chatbot institucional

El endpoint `src/pages/api/chat.ts` responde consultas usando el contenido indexado en `src/data/site-content.md`. Ese archivo se regenera automáticamente antes de cada build (`prebuild`) a partir del contenido en `src/pages` y `src/content`. Si el contenido del sitio cambia y necesitas actualizarlo sin hacer build completo, corre `bun run index`.

## 📦 Despliegue

El despliegue a producción es automático: cada push a `main` dispara el workflow `.github/workflows/deploy.yml`, que se conecta por SSH al VPS, hace `git pull`, `bun install`, `bun run build` y reinicia el proceso `portal-unag` con PM2.

## 🛠️ Stack

- [Astro](https://docs.astro.build) (SSR con adapter `@astrojs/node`)
- [React](https://react.dev) para islas interactivas
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) + `lucide-react` para componentes/iconos
- [Bun](https://bun.sh) como runtime y gestor de paquetes
- PM2 para gestión de proceso en producción