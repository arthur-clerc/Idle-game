document.addEventListener("DOMContentLoaded", function () {
  const layers = document.querySelectorAll(".parallax-layer");
  const baseZoom = 1.1;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  layers.forEach(function (layer, index) {
    const speed = index + 1;

    const x = (window.innerWidth / 2 - mouseX * speed) / 100;
    const y = (window.innerHeight / 2 - mouseY * speed) / 100;

    layer.style.transform = `translateX(${x}px) translateY(${y}px) scale(${baseZoom})`;
  });

  document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    layers.forEach(function (layer, index) {
      const speed = index + 1;
      const x = (window.innerWidth / 2 - mouseX * speed) / 100;
      const y = (window.innerHeight / 2 - mouseY * speed) / 100;

      layer.style.transform = `translateX(${x}px) translateY(${y}px) scale(${baseZoom})`;
    });
  });
});
