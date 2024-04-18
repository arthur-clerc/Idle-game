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

fetch('data.json')
.then(response => response.json())
.then(data => {
  localStorage.setItem('shopItems', JSON.stringify(data));
})
.catch(error => console.error('Erreur lors du chargement des données :', error));
