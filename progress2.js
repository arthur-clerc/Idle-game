const levels = {
    iron: { min: 0, max: 20000, color: '#b9b9b9', increment: 300 },
    gold: { min: 20000, max: 120000, color: '#c4a82c', increment: 500 },
    diamond: { min: 120000, max: 340000, color: '#33b9b4', increment: 900 },
    nezerit: { min: 340000, max: 780000, color: '#4a234b', increment: 1700 },
  };
  
  const maxProgress = 780000;
  
  let currentProgress = localStorage.getItem('progress') ? parseInt(localStorage.getItem('progress'), 10) : 0;
  let level = Object.values(levels).find(l => currentProgress >= l.min && currentProgress <= l.max);
  let addValue = level ? level.increment : 100;
  
  function updateProgress() {
    currentProgress = Math.min(currentProgress + addValue, maxProgress);
    localStorage.setItem('progress', currentProgress.toString());
    updateProgressBar();
    updateProgressColor();
  
    if (currentProgress >= maxProgress) {
        document.getElementById('win-message').style.display = 'block';
    }
  }
  
  function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const progressPercentage = (currentProgress / maxProgress) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressText.textContent = `${currentProgress.toLocaleString()} / ${maxProgress.toLocaleString()}`;
  }
  
  function updateProgressColor() {
    const progressBar = document.getElementById('progress-bar');
    const level = Object.values(levels).reverse().find(l => currentProgress >= l.min);
    const color = level ? level.color : levels.iron.color;
    progressBar.style.backgroundImage = `linear-gradient(to right, ${levels.iron.color}, ${color})`;
  }
  
  function updateGoldPerClick() {
    const armorSet = JSON.parse(localStorage.getItem('armorSet')) || {};
    let goldPerClick = 100;
  
    switch (armorSet.name) {
      case 'iron':
        goldPerClick = 300;
        break;
      case 'gold':
        goldPerClick = 500;
        break;
      case 'diamond':
        goldPerClick = 900;
        break;
      case 'nezerit':
        goldPerClick = 1700;
        break;
      default:
        goldPerClick = 100;
        break;
    }
  
    localStorage.setItem('goldPerClick', goldPerClick.toString());
  }
  
  function updateCurrentGold() {
    let currentGold = localStorage.getItem('currentGold');
    currentGold = currentGold ? parseInt(currentGold, 10) : 0;
    const goldPerClick = parseInt(localStorage.getItem('goldPerClick')) || 100;
  
    currentGold += goldPerClick;
  
    localStorage.setItem('currentGold', currentGold.toString());
  
    const currentGoldElement = document.getElementById('currentGold');
  
    if (currentGold) {
        currentGoldElement.textContent = `Current Gold: ${currentGold.toLocaleString()}`;
    } else {
        currentGoldElement.textContent = `Current Gold: 0`;
    }
  }
  
  document.addEventListener('click', () => {
    if (currentProgress < maxProgress) {
        updateProgress();
        updateCurrentGold();
    }
  });
  
  function checkArmorSetCompletion() {
    const boughtItems = JSON.parse(localStorage.getItem('boughtItems')) || {};
    let boughtIron = false;
    let boughtGold = false;
    let boughtDiamond = false;
    let boughtnezerit = false;
  
    for (const itemId in boughtItems) {
        const id = parseInt(itemId);
        if (id >= 0 && id <= 3) boughtIron = true;
        else if (id >= 4 && id <= 7) boughtGold = true;
        else if (id >= 8 && id <= 11) boughtDiamond = true;
        else if (id >= 12 && id <= 15) boughtnezerit = true;
    }
  
    if (boughtIron && boughtGold && boughtDiamond && boughtnezerit) {
        const armorSet = {
            name: 'nezerit',
            ...data.armorSet.nezeritSet
        };
        localStorage.setItem('armorSet', JSON.stringify(armorSet));
        updateGoldPerClick();
    }
  }
  
  function handleItemClick(piece) {
    let boughtItems = JSON.parse(localStorage.getItem('boughtItems')) || {};
  
    if (!boughtItems[piece.id]) {
        boughtItems[piece.id] = {
            src: piece.src,
            price: piece.price,
            buyReward: piece.buyReward,
            goldPerSec: piece.goldPerSec
        };
        localStorage.setItem('boughtItems', JSON.stringify(boughtItems));
  
        checkArmorSetCompletion(boughtItems);
        updateProgressIncrement();
        updateCurrentGold();
        console.log('Element acheté:', piece);
    } else {
        console.log('Element déjà acheté:', piece);
    }
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
  