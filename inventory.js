const boughtItemsInventoryJson = JSON.parse(localStorage.getItem("boughtItems"));
const gridContainerInventory = document.querySelector(".grid-container-inventory");
const asideInventory = document.querySelector("#asideInventory");
const inventory = document.getElementById("inventory");
const shop = document.getElementById("shop");
let isOpenedInventory = false;
let isOpenedShop = false;
function toggleShop() {
  if (isOpenedInventory === false && isOpenedShop === false) {
    asideShop.classList.toggle("open");
    isOpenedShop = true;
  } else if (isOpenedInventory === true && isOpenedShop === false)  {
    asideInventory.classList.toggle("open");
    isOpenedInventory = false;
    asideShop.classList.toggle("open");
    isOpenedShop = true;
  } else if (isOpenedInventory === false && isOpenedShop === true) {
    asideShop.classList.toggle("open");
    isOpenedShop = false;
  }
}

function toggleInventory() {
  if (isOpenedShop === false && isOpenedInventory === false) {
    asideInventory.classList.toggle("open");
    isOpenedInventory = true;
  } else if (isOpenedShop === true && isOpenedInventory === false) {
    asideShop.classList.toggle("open");
    isOpenedShop = false;
    asideInventory.classList.toggle("open");
    isOpenedInventory = true;
  } else if (isOpenedShop === false && isOpenedInventory === true) {
    asideInventory.classList.toggle("open");
    isOpenedInventory = false;
  }
}

document.addEventListener("keydown", function(event) {
  if (event.key === "s") {
    toggleShop();
  } else if (event.key === "i") {
    toggleInventory();
  }
});

shop.addEventListener("click", toggleShop);
inventory.addEventListener("click", toggleInventory);

function fetchDataAndCreateElements() {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('shopItems', JSON.stringify(data));
      const armorSets = data.armorSet;
      const gridContainerShop = document.querySelector('.grid-container-shop');
      let itemIdCounter = 1;

      for (const armorSetName in armorSets) {
        const armorSet = armorSets[armorSetName];
        for (const pieceName in armorSet) {
          const piece = armorSet[pieceName];
          const src = piece.src;
          const price = piece.price;
          const existingItem = document.querySelector(`#grid-item${itemIdCounter}`);
          
          if (!existingItem && src && price) {
            const newItem = document.createElement('div');
            newItem.id = `grid-item${itemIdCounter}`;
            newItem.className = 'shopItemIcon';
            newItem.style.backgroundSize = 'cover';
            newItem.style.backgroundImage = `url("${src}")`;
            newItem.style.padding = '0';
            newItem.innerHTML = `
            <div style='display:flex; justify-content:center; align-items:center;'>
            <span style='display:flex; justify-content:center;color:white;'>${price}</span>
            <img class='goldPiecePng' src='assets/miscs/goldPiece.png'>
            </div>
            `;
            
            newItem.addEventListener('click', () => {
              if (piece.price <= currentGold) {
   
                if (!boughtItems[piece.id]) {
                  boughtItems[piece.id] = {
                    src: piece.src,
                    price: piece.price,
                    buyReward: piece.buyReward,
                    goldPerSec: piece.goldPerSec
                  };
                  newItem.classList.add('bought');
                  localStorage.setItem('boughtItems', JSON.stringify(boughtItems));
                  currentGold -= piece.price;
            
                  checkArmorSetCompletion(boughtItems);
                  updateCurrentGold();
                  checkCharacterColor();
                  displayInventory();

                  console.log('Element acheté:', piece);
                } else {
                  console.log('Element déjà acheté:', piece);
                }
              } else {
                console.log(`Vous n'avez pas assez de gold pour acheter cette pièce !`);
              }
            });

            gridContainerShop.appendChild(newItem);
            itemIdCounter++;
          }
        }
      }
      checkBoughtItems();
    })
    .catch(error => console.error('Error fetching data:', error));
}

fetchDataAndCreateElements();


function checkCharacterColor() {
  const armorSet = JSON.parse(localStorage.getItem('armorSet')) || {};
  const basicKnight = document.getElementById('basicKnight');
  
  switch (armorSet.name) {
    case 'iron':
      basicKnight.src = '/assets/characters/ironKnight.png';
      break;
    case 'gold':
      basicKnight.src = '/assets/characters/goldKnight.png';
      break;
    case 'diamond':
      basicKnight.src = '/assets/characters/diamondKnight.png';
      break;
    case 'nezerit':
      basicKnight.src = '/assets/characters/nezeritKnight.png';
      break;
    default:
      basicKnight.src = '/assets/characters/basicKnight.png';
      break;
  }
}
function displayInventory() {
  const boughtItems = JSON.parse(localStorage.getItem('boughtItems')) || {};
  const gridContainerInventory = document.querySelector('.grid-container-inventory');
  gridContainerInventory.innerHTML = '';
  let itemIdCounter = 1;

  for (const itemId in boughtItems) {
      const item = boughtItems[itemId];
      const src = item.src;
      const goldPerSec = item.goldPerSec;

      const newInventoryItem = document.createElement('div');
      newInventoryItem.id = `grid-inventory${itemIdCounter}`;
      newInventoryItem.className = 'shopItemIcon';
      newInventoryItem.style.backgroundSize = 'cover';
      newInventoryItem.style.backgroundImage = `url("${src}")`;
      newInventoryItem.style.padding = '0';
      newInventoryItem.innerHTML = `
          <div style='display:flex; justify-content:center; align-items:center;'>
              <span style='display:flex; justify-content:center;color:white;'>${goldPerSec} gold/s</span>
          </div>
      `;

      gridContainerInventory.appendChild(newInventoryItem);

      itemIdCounter++;
  }

}

displayInventory();

function displayRandomChestItems() {
  const bonusLoot = JSON.parse(localStorage.getItem('BonusLoot')) || {};
  const gridContainerRandomChestLoots = document.querySelector('.grid-container-randomChestLoots');
  gridContainerRandomChestLoots.innerHTML = '';
  let itemIdCounter = 1;

  for (const bonusId in bonusLoot) {
    const bonus = bonusLoot[bonusId];
    const src = bonus.src;
    const goldPerSec = bonus.goldPerSec;

    const newRandomChestItem = document.createElement('div');
    newRandomChestItem.id = `grid-bonus${itemIdCounter}`;
    newRandomChestItem.className = 'shopItemIcon';
    newRandomChestItem.style.backgroundSize = 'cover';
    newRandomChestItem.style.backgroundImage = `url("${src}")`;
    newRandomChestItem.style.padding = '0';
    newRandomChestItem.innerHTML = `
        <div style='display:flex; justify-content:center; align-items:center;'>
            <span style='display:flex; justify-content:center;color:white;'>${goldPerSec} gold/s</span>
        </div>
    `;

    gridContainerRandomChestLoots.appendChild(newRandomChestItem);

    itemIdCounter++;
  }
}

displayRandomChestItems()

function checkBoughtItems() {
  const boughtItems = JSON.parse(localStorage.getItem('boughtItems')) || {};
  for (const itemId in boughtItems) {
    const itemElement = document.getElementById(`grid-item${itemId}`);
    if (itemElement) {
      itemElement.classList.add('bought');
    }
  }
}
