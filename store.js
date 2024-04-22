const asideShop = document.querySelector("#asideShop");
const shop = document.getElementById("shop");
let isOpenedShop = false;

shop.addEventListener("click", function () {
  if (isOpenedInventory === false && isOpenedShop === false) {
    asideShop.classList.toggle("open");
    isOpenedShop = true;
  } else if (isOpenedInventory === true && isOpenedShop === false) {
    asideInventory.classList.toggle("open");
    isOpenedInventory = false;
    asideShop.classList.toggle("open");
    isOpenedShop = true;
  } else if (isOpenedInventory === false && isOpenedShop === true) {
    asideShop.classList.toggle("open");
    isOpenedShop = false;
  }
});

fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    localStorage.setItem("shopItems", JSON.stringify(data));
  })
  .catch((error) =>
    console.error("Erreur lors du chargement des données :", error)
  );

function fetchDataAndCreateElements() {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      const armorSets = data.armorSet;
      const gridContainerShop = document.querySelector(".grid-container-shop");
      let itemIdCounter = 1;

      for (const armorSetName in armorSets) {
        const armorSet = armorSets[armorSetName];
        for (const pieceName in armorSet) {
          const piece = armorSet[pieceName];
          const src = piece.src;
          const price = piece.price;
          const existingItem = document.querySelector(
            `#grid-item${itemIdCounter}`
          );

          if (!existingItem && src && price) {
            const newItem = document.createElement("div");
            newItem.id = `grid-item${itemIdCounter}`;
            newItem.className = "shopItemIcon";
            newItem.style.backgroundSize = "cover";
            newItem.style.backgroundImage = `url("${src}")`;
            newItem.style.padding = "0";
            newItem.innerHTML = `
            <div style='display:flex; justify-content:center; align-items:center;'>
            <span style='display:flex; justify-content:center;color:white;'>${price}</span>
            <img class='goldPiecePng' src='assets/miscs/goldPiece.png'>
            </div>
            `;

            newItem.addEventListener("click", () => {
              handleItemClick(piece);
            });

            gridContainerShop.appendChild(newItem);
            itemIdCounter++;
          }
        }
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}



// function handleItemClick(piece) {
//   let boughtItems = JSON.parse(localStorage.getItem("boughtItems")) || {};

//   if (!boughtItems[piece.id]) {
//     boughtItems[piece.id] = {
//       src: piece.src,
//       price: piece.price,
//       buyReward: piece.buyReward,
//       goldPerSec: piece.goldPerSec,
//     };
//     localStorage.setItem("boughtItems", JSON.stringify(boughtItems));

//     console.log("Element acheté:", piece);
//   } else {
//     console.log("Element déjà acheté:", piece);
//   }
// }

fetchDataAndCreateElements();
