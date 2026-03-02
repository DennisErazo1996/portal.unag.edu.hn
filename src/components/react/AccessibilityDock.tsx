import React, { useState, useEffect } from 'react';
import { Sun, Moon, Globe, Settings, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Language = 'es' | 'en';

export default function AccessibilityDock() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState<Language>('es');

  // Initialize theme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    // Detect language from current URL
    const currentPath = window.location.pathname;
    const detectedLang: Language = currentPath.startsWith('/en/') || currentPath === '/en' ? 'en' : 'es';
    setLanguage(detectedLang);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleLanguage = () => {
    const currentPath = window.location.pathname;
    let newPath: string;

    if (language === 'es') {
      // Switching to English: add /en prefix
      if (currentPath === '/') {
        newPath = '/en';
      } else {
        newPath = `/en${currentPath}`;
      }
    } else {
      // Switching to Spanish: remove /en prefix
      if (currentPath === '/en' || currentPath === '/en/') {
        newPath = '/';
      } else if (currentPath.startsWith('/en/')) {
        newPath = currentPath.substring(3); // Remove '/en'
      } else {
        newPath = currentPath;
      }
    }

    // Navigate to the new language version
    window.location.href = newPath;
  };

  return (
    <div 
      className="fixed bottom-6 left-4 z-50 font-sans"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div
        className={cn(
          "dakr:bg-zinc-900 bg-unag-dark-green dark:bg-zinc-800 rounded-full  shadow-lg border border-unag-green transition-all duration-300 ease-in-out overflow-hidden flex items-center",
          isExpanded ? "px-2 py-2 gap-1" : "p-2"
        )}
      >
        {/* Collapsed indicator */}
        <button
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-white dark:text-white hover:text-white hover:bg-zinc-700 transition-all duration-200",
            isExpanded && "hidden"
          )}
          aria-label="Abrir opciones de accesibilidad"
        >
          <Settings size={18} />
        </button>

        {/* Expanded options */}
        <div className={cn(
          "flex items-center gap-1 transition-all duration-300",
          isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
        )}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:text-white hover:bg-unag-green transition-all duration-200"
            aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            title={isDark ? "Modo claro" : "Modo oscuro"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-white" />

          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="h-8 px-2 rounded-full flex items-center gap-1 text-white hover:text-white hover:bg-unag-green transition-all duration-200 text-xs font-medium"
            aria-label={language === 'es' ? "Switch to English" : "Cambiar a Español"}
            title={language === 'es' ? "English" : "Español"}
          >
            <Globe size={16} />
            <span className="uppercase">{language}</span>
          </button>

          {/* Collapse indicator */}
          <ChevronRight size={14} className="text-white ml-1" />
        </div>
      </div>
    </div>
  );
}
