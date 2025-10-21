import Rellax from 'rellax';

  document.addEventListener('DOMContentLoaded', () => {
    const rellax = new Rellax('.rellax', {
      speed: -2,
      center: false,
      wrapper: undefined,
      round: true,
      vertical: true,
      horizontal: false
    });
});