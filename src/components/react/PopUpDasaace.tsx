import { useEffect, useState } from "react";
import { X } from "lucide-react";

import CuentaRegresiva from "@/components/react/CuentaRegresiva";

const COOKIE_NAME = "dasaace_popup_shown";
const COOKIE_DAYS = 3;

function shouldShowPopup(): boolean {
  return !document.cookie.split(";").some((c) => c.trim().startsWith(`${COOKIE_NAME}=`));
}

function markPopupShown(): void {
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_DAYS);
  document.cookie = `${COOKIE_NAME}=1; expires=${expires.toUTCString()}; path=/`;
}

const PopUpDasaace = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(function initPopup() {
    if (!shouldShowPopup()) return;
    markPopupShown();
    setIsOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
  }, []);

  useEffect(
    function syncBodyScroll() {
      if (!isOpen) {
        document.body.style.removeProperty("overflow");
        return;
      }

      document.body.style.overflow = "hidden";

      return function restoreBodyScroll() {
        document.body.style.removeProperty("overflow");
      };
    },
    [isOpen],
  );

  function handleClose(): void {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 300);
  }

  function handleImageError(): void {
    setHasImageError(true);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[10001] flex items-center justify-center bg-unag-dark-green/70 px-4 py-4 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`relative w-full max-w-2xl overflow-hidden rounded-[1.5rem] border border-unag-green/20 bg-white shadow-2xl dark:bg-background scale-100 lg:scale-80 transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-unag-green/20 bg-white/90 text-unag-dark-green transition-colors duration-200 hover:bg-unag-green hover:text-white dark:bg-unag-dark-green/90 dark:text-white dark:hover:bg-unag-green"
          aria-label="Cerrar ventana emergente"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          <div className="relative h-[250px] sm:h-[300px] bg-unag-dark-green">
            {!hasImageError ? (
              <img
                src={'/img/dasaace-animation-loop-2.gif'}
                alt="Animacion de DASAACE"
                className="h-full w-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className="flex h-full min-h-[280px] items-center justify-center bg-gradient-to-br from-unag-dark-green via-unag-green to-unag-light-green p-8 text-center">
                <p className="max-w-sm text-sm font-semibold tracking-[0.2em] text-white/90 uppercase">
                  DASAACE
                </p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-unag-dark-green/70 via-transparent to-transparent" />
          </div>

          <div className="bg-unag-dark-green h-10 w-full flex items-center justify-center">
            <p className="text-white text-[11px] lg:text-[13px]">“Yo remo con determinación a la acreditación”</p>
          </div>

          <div className="relative p-4 sm:p-5">
            
            <div className="inline-flex items-center gap-2 rounded-full bg-unag-green/10 px-4 py-2 backdrop-blur-sm">
              <div className="h-2.5 w-2.5 rounded-full bg-unag-green animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-unag-dark-green dark:text-unag-yellow">
                DASAACE
              </span>
            </div>

            <h2 className="mt-3 max-w-xl text-xl font-extrabold leading-tight text-unag-dark-green dark:text-white sm:text-2xl">
              La unag con mira a la acreditacion institucional
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-unag-gray dark:text-white/75">
                Trabajamos por el aseguramiento de la calidad académica e institucional de la Universidad Nacional de Agricultura, fomentando la mejora continua y la cultura de calidad.
            </p>

            <div className="w-70 mx-auto">
              <CuentaRegresiva
                year={'2026'}
                month={'september'}
                day={'20'}
              />
            </div>
            <div className="flex w-full justify-center mt-4">
              <a
                href="https://dasaace.unag.edu.hn"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center rounded-sm bg-unag-green px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-unag-dark-green sm:w-auto"
              >
                Ir a DASAACE
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopUpDasaace;