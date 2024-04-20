const boughtItemsInventoryJson = JSON.parse(localStorage.getItem("boughtItems"));
const gridContainerInventory = document.querySelector(".grid-container-inventory");
const asideInventory = document.querySelector("#asideInventory");
const inventory = document.getElementById("inventory");
let isOpenedInventory = false;

inventory.addEventListener("click", function () {
  if (!isOpenedInventory) {
    asideInventory.classList.toggle("open");
    isOpenedInventory = true;
    if (isOpenedShop) {
      asideShop.classList.toggle("open");
      isOpenedShop = false;
    }
  } else {
    asideInventory.classList.toggle("open");
    isOpenedInventory = false;
  }
});

let itemIdCounterInventory = 1;

for (let key in boughtItemsInventoryJson) {
  let itemInventory = boughtItemsInventoryJson[key];
  let srcImgItemInventory = itemInventory.src;
  let priceItemInventory = itemInventory.price;

  if (srcImgItemInventory && priceItemInventory) {
    const newItemInventory = document.createElement("div");
    newItemInventory.id = `grid-item-inventory${itemIdCounterInventory}`;
    newItemInventory.className = "inventoryItemIcon";
    newItemInventory.style.backgroundImage = `url("${srcImgItemInventory}")`;
    newItemInventory.style.backgroundSize = "cover";

    const innerDiv = document.createElement("div");
    const priceSpan = document.createElement("span");
    const goldPieceImg = document.createElement("img");
    innerDiv.className = "innerDiv";
    priceSpan.className = "priceSpan";
    goldPieceImg.className = "goldPiecePng";
    priceSpan.textContent = priceItemInventory;
    goldPieceImg.src = "assets/miscs/goldPiece.png";

    gridContainerInventory.appendChild(newItemInventory);
    newItemInventory.appendChild(innerDiv);
    innerDiv.appendChild(priceSpan);
    innerDiv.appendChild(goldPieceImg);
    itemIdCounterInventory++;
  }
}


