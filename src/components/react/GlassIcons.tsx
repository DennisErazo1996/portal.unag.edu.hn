import React from 'react';
import { GraduationCap, Laptop, Monitor, Leaf } from 'lucide-react';

export interface GlassIconsItem {
  icon: React.ReactNode;
  color: string;
  label: string;
  url: string;
  customClass?: string;
}

export interface GlassIconsProps {
  className?: string;
}

const gradientMapping: Record<string, string> = {
  green1: 'linear-gradient(hsl(123, 90%, 20%), hsl(108, 90%, 18%))',
};

const items: GlassIconsItem[] = [
  { icon: <GraduationCap />, color: 'green1', label: 'Maestrías', url: 'https://maestrias.unag.edu.hn' },
  { icon: <Laptop />, color: 'green1', label: 'SED', url: '/sed' },
  { icon: <Monitor />, color: 'green1', label: 'Moodle', url: '/campus-virtual' },
  { icon: <Leaf />, color: 'green1', label: 'Carreras', url: '/carreras' },
  ];

const GlassIcons: React.FC<GlassIconsProps> = ({ className }) => {
  const getBackgroundStyle = (color: string): React.CSSProperties => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  return (
    <div className={`flex scale-70 lg:scale-130 origin-right gap-8  mx-auto py-[3em] text-white overflow-visible ${className || ''}`}>
      {items.map((item, index) => (
        <a
          key={index}
          href={item.url}
          aria-label={item.label}
          className={`relative z-10 bg-transparent outline-none w-[4.5em] h-[4.5em] [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] group ${
            item.customClass || ''
          }`}
        >
          <span
            className="absolute top-0 left-0 w-full h-full rounded-[1.25em] block transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[100%_100%] rotate-[15deg] group-hover:[transform:rotate(25deg)_translate3d(-0.5em,-0.5em,0.5em)]"
            style={{
              ...getBackgroundStyle(item.color),
              boxShadow: '0.5em -0.5em 0.75em hsla(223, 10%, 10%, 0.15)'
            }}
          ></span>

          <span
            className="absolute top-0 left-0 w-full h-full rounded-[1.25em] bg-[hsla(0,0%,100%,0.15)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[80%_50%] flex backdrop-blur-[0.75em] [-webkit-backdrop-filter:blur(0.75em)] transform group-hover:[transform:translateZ(2em)]"
            style={{
              boxShadow: '0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset'
            }}
          >
            <span className="m-auto w-[1.5em] h-[1.5em] flex items-center justify-center" aria-hidden="true">
              {item.icon}
            </span>
          </span>

          <span className="absolute top-full left-0 right-0 text-center text-[12px] whitespace-nowrap leading-[2] text-base opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] translate-y-0 group-hover:opacity-100 group-hover:[transform:translateY(20%)]">
            {item.label}
          </span>
        </a>
      ))}
    </div>
  );
};

export default GlassIcons;
