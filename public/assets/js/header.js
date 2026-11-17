(() => {
  const enlace = document.querySelector('.config-link');

  if (!enlace) return;

  enlace.addEventListener('mouseenter', () => {
    enlace.classList.add('gear-hover');
  });

  enlace.addEventListener('mouseleave', () => {
    enlace.classList.remove('gear-hover');
  });
})();
