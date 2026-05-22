interface Props {
    year: string;
    day: string;
    month: string;
}

const cuentaRegresiva = (props: Props) => {
  let countdownInterval: any;

  const timer = () => {
    const currentDate = new Date();
    const targetDateObj = new Date(`${props.month} ${props.day} ${props.year} 00:00:00`);
    const distance = targetDateObj.getTime() - currentDate.getTime();

    // Si el tiempo ha pasado, detener el countdown
    if (distance <= 0) {
      clearInterval(countdownInterval);

      // Mostrar ceros
      const daysEl = document.getElementById("days");
      const hoursEl = document.getElementById("hours");
      const minutesEl = document.getElementById("minutes");
      const secondsEl = document.getElementById("seconds");

      if (daysEl) daysEl.innerHTML = "0";
      if (hoursEl) hoursEl.innerHTML = "0";
      if (minutesEl) minutesEl.innerHTML = "0";
      if (secondsEl) secondsEl.innerHTML = "0";

      // Mostrar el botón
      const btnEl = document.getElementById("inscribirse-btn");
      if (btnEl) {
        btnEl.classList.remove("hidden");
        btnEl.style.display = "inline-flex";
      }
      document
        .querySelectorAll("#countdown-container")
        .forEach((el) => el.classList.add("hidden"));
      return;
    }

    // Mantener el botón oculto mientras el countdown está activo
    const btnEl = document.getElementById("inscribirse-btn");
    if (btnEl) {
      btnEl.classList.add("hidden");
      btnEl.style.display = "none";
    }

    // Calculate total days from now until target date
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));

    // Calculate remaining hours, minutes, and seconds
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (daysEl) daysEl.innerHTML = String(days);
    if (hoursEl) hoursEl.innerHTML = String(hours);
    if (minutesEl) minutesEl.innerHTML = String(minutes);
    if (secondsEl) secondsEl.innerHTML = String(seconds);
  };

  // Ejecutar timer inmediatamente y luego cada segundo
  timer();
  countdownInterval = setInterval(timer, 1000);

  return (
    <div id="countdown-container" className="mt-10">
      {/* <div className="space-y-2 mb-6">
        <p className="text-xs font-bold tracking-widest uppercase text-unag-dark-green dark:text-unag-yellow">
          Tiempo para inscripción:
        </p>
      </div> */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        <div className="flex flex-col items-center">
          <div className="w-full aspect-square rounded-lg bg-unag-green/10 dark:bg-unag-green/20 border border-unag-green/30 dark:border-unag-green/40 flex items-center justify-center hover:border-unag-green/60 dark:hover:border-unag-green/70 transition-all duration-300">
            <h2
              id="days"
              className="text-xl sm:text-2xl md:text-3xl font-bold text-unag-green dark:text-unag-yellow"
            >
              00
            </h2>
          </div>
          <p className="text-xs font-semibold text-unag-dark-green dark:text-white mt-2">
            Días
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full aspect-square rounded-lg bg-unag-green/10 dark:bg-unag-green/20 border border-unag-green/30 dark:border-unag-green/40 flex items-center justify-center hover:border-unag-green/60 dark:hover:border-unag-green/70 transition-all duration-300">
            <h2
              id="hours"
              className="text-xl sm:text-2xl md:text-3xl font-bold text-unag-green dark:text-unag-yellow"
            >
              00
            </h2>
          </div>
          <p className="text-xs font-semibold text-unag-dark-green dark:text-white mt-2">
            Horas
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full aspect-square rounded-lg bg-unag-green/10 dark:bg-unag-green/20 border border-unag-green/30 dark:border-unag-green/40 flex items-center justify-center hover:border-unag-green/60 dark:hover:border-unag-green/70 transition-all duration-300">
            <h2
              id="minutes"
              className="text-xl sm:text-2xl md:text-3xl font-bold text-unag-green dark:text-unag-yellow"
            >
              00
            </h2>
          </div>
          <p className="text-xs font-semibold text-unag-dark-green dark:text-white mt-2">
            Min
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full aspect-square rounded-lg bg-unag-green/10 dark:bg-unag-green/20 border border-unag-green/30 dark:border-unag-green/40 flex items-center justify-center hover:border-unag-green/60 dark:hover:border-unag-green/70 transition-all duration-300">
            <h2
              id="seconds"
              className="text-xl sm:text-2xl md:text-3xl font-bold text-unag-green dark:text-unag-yellow"
            >
              00
            </h2>
          </div>
          <p className="text-xs font-semibold text-unag-dark-green dark:text-white mt-2">
            Seg
          </p>
        </div>
      </div>
    </div>
  );
};

export default cuentaRegresiva;
