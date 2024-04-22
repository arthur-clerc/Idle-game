let currentGoldElement = document.getElementById('currentGold');
let winMessage = document.getElementById('win-message');
let progressBar = document.getElementById('progress-bar');
let progressText = document.getElementById('progress-text');
let goldPerClickSpan = document.getElementById('goldPerClickSpan');
let goldPerSecSpan = document.getElementById('goldPerSecSpan')
let boughtItems = JSON.parse(localStorage.getItem('boughtItems')) || {};
let currentGold = localStorage.getItem('currentGold');
let currentProgress = localStorage.getItem('progress') ? parseInt(localStorage.getItem('progress'), 10) : 0;
const maxProgress = 1000000;
let reset = document.getElementById('reset');

fetch("armorSet.json")
  .then((response) => response.json())
  .then((data) => {
    localStorage.setItem("armorSetJSON", JSON.stringify(data));
  })
  .catch((error) =>
    console.error("Erreur lors du chargement des données :", error)
  );

window.addEventListener('load', () => {
  const currentGold = parseInt(localStorage.getItem('currentGold'));
  if (currentGold) {
    currentGoldElement.textContent = `Current Gold: ${currentGold.toLocaleString()}`;
} else {
    currentGoldElement.textContent = `Current Gold: 0`;
}

  const goldPerClick = parseInt(localStorage.getItem('goldPerClick'));
  if (goldPerClick) {
  goldPerClickSpan.textContent = `Gold/Clic: ${goldPerClick.toLocaleString()}`;
} else {
  goldPerClickSpan.textContent = `Gold/Clic: 0`;
}

  const goldPerSec = parseInt(localStorage.getItem('goldPerSec'));
    if (goldPerSec) {
      goldPerSecSpan.textContent = `Gold/Sec: ${goldPerSec.toLocaleString()}`;
    } else {
  goldPerSecSpan.textContent = `Gold/Sec: 0`;
  }

});

function updateCurrentGold() {

  currentGold = currentGold ? parseInt(currentGold, 10) : 0;

  const goldPerClick = parseInt(localStorage.getItem('goldPerClick'), 10) || 100;
  
  currentGold += goldPerClick;

  currentGoldElement.textContent = `Current Gold: ${currentGold.toLocaleString()}`;

  localStorage.setItem('currentGold', currentGold.toString());

}

const levels = {
  basic: { min: 0, max: 20000, color: '#523414', increment: 100 },
  iron: { min: 20000, max: 120000, color: '#b9b9b9', increment: 300 },
  gold: { min: 120000, max: 340000, color: '#c4a82c', increment: 500 },
  diamond: { min: 340000, max: 780000, color: '#33b9b4', increment: 900 },
  nezerit: { min: 780000, max: 1000000, color: '#4a234b', increment: 900 },
};

function updateProgress() {
  const level = Object.values(levels).find(l => currentProgress >= l.min && currentProgress <= l.max);
  const addValue = level ? level.increment : 100;
  currentProgress = Math.min(currentProgress + addValue, maxProgress);
  localStorage.setItem('progress', currentProgress.toString());
  updateProgressBar();
  updateProgressColor();

  if (currentProgress >= maxProgress) {
      winMessage.style.display = 'block';
  }
}

function updateProgressBar() {
  const progressPercentage = (currentProgress / maxProgress) * 100;
  progressBar.style.width = `${progressPercentage}%`;
  progressText.textContent = `${currentProgress.toLocaleString()} / ${maxProgress.toLocaleString()}`;
}

function updateProgressColor() {
  const level = Object.values(levels).reverse().find(l => currentProgress >= l.min);
  const color = level ? level.color : levels.basic.color;
  progressBar.style.backgroundImage = `linear-gradient(to right, ${levels.basic.color}, ${color})`;
}

function updateGoldPerClick() {
  const armorSet = JSON.parse(localStorage.getItem('armorSet')) || {};
  const basicKnight = document.getElementById('basicKnight');
  let goldPerClick = parseInt(localStorage.getItem('goldPerClick'));
  switch (armorSet.name) {
    case 'iron':
      goldPerClick = 300;
      basicKnight.src = '/assets/characters/ironKnight.png';
      break;
    case 'gold':
      goldPerClick = 500;
      basicKnight.src = '/assets/characters/goldKnight.png';
      break;
    case 'diamond':
      goldPerClick = 900;
      basicKnight.src = '/assets/characters/diamondKnight.png';
      break;
    case 'nezerit':
      goldPerClick = 1700;
      basicKnight.src = '/assets/characters/nezeritKnight.png';
      break;
    default:
      goldPerClick = 100;
      basicKnight.src = '/assets/characters/basicKnight.png';
      break;
  }
  
  localStorage.setItem('goldPerClick', goldPerClick.toString());
  
  if (goldPerClick) {
    goldPerClickSpan.textContent = `Gold/Clic: ${goldPerClick.toLocaleString()}`;
  } else {
    goldPerClickSpan.textContent = `Gold/Clic: 0`;
  }
}

function updateGoldPerSec() {
  const boughtItems = JSON.parse(localStorage.getItem('boughtItems')) || {};
  let totalGoldPerSec = 0;

  for (const itemId in boughtItems) {
    const item = boughtItems[itemId];
    const goldPerSec = item.goldPerSec || 0;
    totalGoldPerSec += goldPerSec;
  }

  localStorage.setItem('goldPerSec', totalGoldPerSec.toString());
  goldPerSecSpan.textContent = `Gold/Sec: ${totalGoldPerSec.toLocaleString()}`;
}

function checkArmorSetCompletion(boughtItems) {
  const armorSets = {
    iron: [0, 1, 2, 3],
    gold: [4, 5, 6, 7],
    diamond: [8, 9, 10, 11],
    nezerit: [12, 13, 14, 15]
  };

  for (const set in armorSets) {
    const setIds = armorSets[set];
    if (setIds.every(id => boughtItems[id])) {
      localStorage.setItem('armorSet', JSON.stringify({
        name: set,
        pieces: setIds.map(id => boughtItems[id])
      }));
    }
  }
}

updateProgressBar();
updateProgressColor();

reset.addEventListener('click', function() {
      localStorage.clear();
      location.reload();
})

let goldInterval = null;

function goldPerSecUpdateCurrentGold() {
  
  if (goldInterval !== null) {
    clearInterval(goldInterval);
  }

  goldInterval = setInterval(() => {
    let currentGold = parseInt(localStorage.getItem('currentGold'), 10) || 0;
    const goldPerSec = parseInt(localStorage.getItem('goldPerSec'), 10) || 0;

    if (goldPerSec) {
      currentGold += goldPerSec;
      localStorage.setItem('currentGold', currentGold.toString());
      currentGoldElement.textContent = `Current Gold: ${currentGold.toLocaleString()}`;
    }
  }, 1000);
}

goldPerSecUpdateCurrentGold();