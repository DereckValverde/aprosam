document.addEventListener("DOMContentLoaded", function () {
  // 1. Bloquear el zoom con la rueda del ratón (Ctrl + Scroll)
  window.addEventListener(
    "wheel",
    function (e) {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    },
    { passive: false },
  );

  // 2. Bloquear los atajos de teclado para hacer zoom (Ctrl + '+', Ctrl + '-', Ctrl + '0')
  window.addEventListener("keydown", function (e) {
    if (
      e.ctrlKey &&
      (e.key === "+" || e.key === "-" || e.key === "=" || e.key === "0")
    ) {
      e.preventDefault();
    }
  });
});
