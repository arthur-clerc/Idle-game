document.addEventListener("DOMContentLoaded", function () {
    
    hideChest();

    setInterval(() => {
        setTimeout(() => {
            const chest = document.getElementById('chest');
           
            chest.style.display = 'block';
        }, 5000);
    }, 1 * 10 * 1000);
    
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

fetch('bonus.json')
  .then(response => response.json())
  .then(data => {
    localStorage.setItem('bonus', JSON.stringify(data));
  })
  .catch(error => console.error('Erreur lors du chargement des données :', error));

function getRandomItem() {
  const bonus = JSON.parse(localStorage.getItem('bonus'));
  const keys = Object.keys(bonus);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return bonus[randomKey];
}

const chest = document.getElementById('chest');
let chestOpened = false;

function hideChest() {
    const chest = document.getElementById('chest');
    chest.style.display = 'none';
    chest.src ='./assets/miscs/chest.png';
}

function openChest() {
  if (!chestOpened) {
    chestOpened = true;

    chest.src = './assets/miscs/chestGif.gif';

    const randomItem = getRandomItem();
    const itemImage = document.createElement('img');
    itemImage.classList.add("randomItem");
    itemImage.classList.add('animate-slide-up-down');
    itemImage.src = randomItem.src;
    itemImage.alt = 'Random Item';
    document.getElementById('chestContainer').appendChild(itemImage);

    setTimeout(() => {
      itemImage.classList.remove('animate-slide-up-down');
      itemImage.classList.add('animate-goOutOfScreen');
    }, 3000);

    setTimeout(() => {
      chest.style.display = 'none';
      document.getElementById('chestContainer').removeChild(itemImage);
      chestOpened = false;
      chest.src ='./assets/miscs/chest.png';
    }, 4500);

    setInterval(() => {
        hideChest();
    }, 10 * 60 * 1000);
  }
}

chest.addEventListener('click', openChest);
