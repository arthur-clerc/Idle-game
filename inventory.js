let asideShop = document.querySelector("#asideShop");
let asideInventory = document.querySelector("#asideInventory");
let shop = document.getElementById('shop');
let inventory = document.getElementById("inventory");
let isOpenedInventory = false;
let isOpenedShop = false;

shop.addEventListener("click", function () {
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
});

inventory.addEventListener("click", function () {
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
});

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
              handleItemClick(piece);
            });

            gridContainerShop.appendChild(newItem);
            itemIdCounter++;
          }
        }
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}

function checkBoughtItems() {
  const boughtItems = JSON.parse(localStorage.getItem('boughtItems'));
  if (boughtItems) {
    boughtItems.forEach(itemId => {
      const item = document.getElementById(`grid-item${itemId}`);
      console.log(itemId);
      if (item) {
        item.classList.add('bought');
        item.removeEventListener('click', handleItemClick);
        item.style.pointerEvents = 'none';
      }
    });
  }
}

fetchDataAndCreateElements();
checkBoughtItems();

