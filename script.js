const api = `https://run.mocky.io/v3/ec196a02-aaf4-4c91-8f54-21e72f241b68`;

const contentBox = document.querySelector(".content");
const sortLink = document.querySelectorAll(".option__sort--link");
const optionSort = document.querySelector(".option__sort");
const sortPizza = document.querySelector(".sort__pizza");
const cartNumber = document.querySelector(".header__logo");

// popup and btn
const popup = document.querySelector(".popup");
const overlay = document.querySelector(".overlay");

const cart = JSON.parse(localStorage.getItem("cartItem")) || {};

const hide = function () {
  overlay.classList.add("hidden");
  popup.classList.add("hidden");
};

let orderLength = 0;
let orderId = [];

///////////////////////////////////////////////////
// FOR PIZZA MARKUP

const orderLengthFunc = function (data) {
  Object.entries(data).forEach((i) => {
    const cartLogo = document.querySelector(".header__logo");

    orderLength += i[1].details.length;
    orderId.push(i[1].id);
    if (orderLength > 0) cartLogo.classList.remove("hidden");

    console.log(orderLength);
    cartLogo.textContent = orderLength;
  });
  orderLength = 0;
};

const addRemoveBtn = function (cartId) {
  const pizzaRemoveBtn = document.querySelectorAll(".food__box-btn-remove");
  const pizzaAddBtn = document.querySelectorAll(".food__box-btn-add");

  pizzaAddBtn.forEach((btn, i) => {
    let id;
    if (cartId[i + 1]) {
      id = cartId[i + 1].id;
    }
    btn.addEventListener("click", () => {
      overlay.classList.remove("hidden");
      popup.classList.remove("hidden");
    });

    pizzaRemoveBtn[i].addEventListener("click", () => {
      if (cart[id].details.length === 0) {
        delete cart[id];
      }
      cart[id].details.pop();
      cart[id].details.splice(-1);

      console.log(id.details.length);
      console.log(pizzaRemoveBtn[i]);
      orderLengthFunc(cart);
    });
  });
};

const renderPizzaMarkup = function (data) {
  const html = data
    .map((pizza) => {
      orderLengthFunc(cart);

      let count;
      if (cart[pizza.id]) {
        count = cart[pizza.id].details.length;
      }
      return `<div class="food__card" id="${pizza.id}">
    <div class="food__card--img">
      <img src="${pizza.img_url}" alt="Pizza" />
    </div>
    <div class="food__text">
      <span class="food__text--cat food__text--cat-${
        pizza.isVeg ? "veg" : "nonveg"
      } "></span>\
      <h3 class="food__text--heading">${pizza.name}</h3>
    </div>

    <p class="food__description">
      ${pizza.description}
    </p>

    <div class="food__info">
      <p class="food__info--raiting ${pizza.rating > 3.9 ? "low" : "high"}">
        <i class="fa-solid fa-star"></i>
        ${pizza.rating}
      </p>
      <p class="food__info--price">RS. ${pizza.price}</p>
    </div>
    <div class="food__box">
      <button class="food__box-btn food__box-btn-remove" id="btn${pizza.id}" ${
        orderId.includes(pizza.id) === false ? "disabled" : ""
      } >
        -
      </button>
      <p class="food__box-count" id="count">${count > 0 ? count : 0}</p>
      <button class="food__box-btn food__box-btn-add">+</button>
    </div>
  </div>`;
    })
    .join("");

  contentBox.innerHTML = "";
  contentBox.insertAdjacentHTML("beforeend", html);
};

///////////////////////////////////////////////////
// FOR POPUP MARKUP

const renderPopup = function (data) {
  const radioMarkup = data.size[0].items
    .map((i) => {
      return `
      <label class="popup__size-option-input">
              <input type="radio" name="size" value="${i.size}" />
              <span>${i.size}</span>
            </label>`;
    })
    .join("");

  const checkboxMarkup = data.toppings[0].items
    .map((i) => {
      return `  <label class="popup__toppings-option-input">
    <input type="checkbox" name="topping" value="${i.name}" />
    <span>${i.name}</span>
  </label>  `;
    })
    .join("");

  const html = `
      <div class="popup__top">
        <h3 class="popup__heading">${data.name}</h3>
        <button class="popup__close-button">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="popup__main">
        <div class="popup__size">
          <h3 class="popup__size-heading">${data.size[0].title}</h3>
          <div class="popup__size-option">
            ${radioMarkup} 
          </div>
        </div>
        <div class="popup__toppings">
          <h3 class="popup__size-heading">${data.toppings[0].title}</h3>
          <div class="popup__toppings-option">    
          ${checkboxMarkup}    
          </div>
        </div>
      </div>

        <p class="popup__error"><p>

      <button type="submit" class="popup__button">Add to cart</button>

  `;
  popup.innerHTML = "";
  popup.insertAdjacentHTML("beforeend", html);
};

//////////////////////////////////////////////////
// SORTING PIZZA BY CATEGORY

const sortByLink = function (data) {
  optionSort.addEventListener("click", (e) => {
    const target = e.target.textContent;
    if (target == "All") {
      renderPizzaMarkup(data);
      sortingPizza(data);
    }
    if (target == "Veg") {
      const veg = data.filter((e) => {
        return e.isVeg;
      });
      renderPizzaMarkup(veg);
      sortingPizza(veg);
    }
    if (target == "Non Veg") {
      const nonVeg = data.filter((e) => {
        return !e.isVeg;
      });
      renderPizzaMarkup(nonVeg);
      sortingPizza(nonVeg);
    }
  });
};

//////////////////////////////////////////////////
// SORTING PIZZA

const sortingPizza = function (data) {
  sortPizza.addEventListener("change", (e) => {
    let sortValue = e.target.value;
    const clone = JSON.parse(JSON.stringify(data));
    let sortedData;

    switch (sortValue) {
      case "all":
        renderPizzaMarkup(data);

        break;
      case "price-high":
        sortedData = clone.sort((a, b) => b.price - a.price);
        renderPizzaMarkup(sortedData);
        break;
      case "price-low":
        sortedData = clone.sort((a, b) => a.price - b.price);
        renderPizzaMarkup(sortedData);
        break;
      case "raiting-high":
        sortedData = clone.sort((a, b) => b.rating - a.rating);
        renderPizzaMarkup(sortedData);
        break;
      case "raiting-low":
        sortedData = clone.sort((a, b) => a.rating - b.rating);
        renderPizzaMarkup(sortedData);
        break;
      case "name-a":
        sortedData = clone.sort((a, b) => a.name.localeCompare(b.name));

        renderPizzaMarkup(sortedData);
        break;
      case "name-z":
        sortedData = clone.sort((a, b) => b.name.localeCompare(a.name));
        renderPizzaMarkup(sortedData);
        break;
    }
  });
};

////////////////////////////////////////////////////
// BUTTON AND POPUP

const buttonAndPopup = function (data) {
  const pizzaRemoveBtn = document.querySelectorAll(".food__box-btn-remove");
  const pizzaAddBtn = document.querySelectorAll(".food__box-btn-add");
  const foodBoxCount = document.querySelectorAll(".food__box-count");

  pizzaAddBtn.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      overlay.classList.remove("hidden");
      popup.classList.remove("hidden");
    });

    pizzaRemoveBtn[i].addEventListener("click", () => {
      let id = data[i].id;
      cart[id].details.pop();
      orderLengthFunc(cart);

      if (cart[id].details.length > 0) {
        pizzaRemoveBtn[i].removeAttribute("disabled");
      } else {
        pizzaRemoveBtn[i].setAttribute("disabled", true);
      }

      console.log(cart[id].details.length);
      foodBoxCount[i].textContent = cart[id].details.length;

      if (cart[id].details.length === 0) {
        delete cart[id];
      }
      localStorage.setItem("cartItem", JSON.stringify(cart));
    });
  });

  // addRemoveBtn(cart);
  contentBox.addEventListener("click", (e) => {
    const target = e.target;
    const targetFood = target.closest(".food__card");
    const popupItem = data.find((pizza) => pizza.id == targetFood.id);

    renderPopup(popupItem);

    const img = popupItem.img_url;
    const { id } = popupItem;
    const { name } = popupItem;
    const { price } = popupItem;
    let size;
    let topping = [];

    const popupAddButton = document.querySelector(".popup__button");
    const popupCloseBtn = document.querySelector(".popup__close-button");

    popupCloseBtn.addEventListener("click", () => {
      hide();
    });

    popup.addEventListener("click", (e) => {
      const target = e.target;
      if (target.name === "size") {
        size = target.value;
      }
      if (target.name === "topping") {
        if (target.checked) {
          topping.push(target.value);
        }
        if (!target.checked) {
          const index1 = topping.indexOf(target.value);
          topping.splice(index1, 1);
        }
      }
    });

    popupAddButton.addEventListener("click", (e) => {
      e.preventDefault();

      const errorMessage = document.querySelector(".popup__error");
      if (size === undefined) {
        errorMessage.textContent = "Please Select Size";
        return;
      }
      if (topping.length <= 0) {
        errorMessage.textContent = "Please Select Toppings";
        return;
      }

      if (!cart[id]) {
        cart[id] = { name, id, img, details: [] };
      }
      cart[id].details.push({
        size,
        topping,
        price,
      });
      hide();

      localStorage.setItem("cartItem", JSON.stringify(cart));

      orderLength = 0;
      orderLengthFunc(cart);

      foodBoxCount[id - 1].textContent = cart[id].details.length;
      if (cart[id].details.length > 0) {
        pizzaRemoveBtn[id - 1].removeAttribute("disabled");
      } else {
        pizzaRemoveBtn[id - 1].addAttribute("disabled", true);
      }

      topping = [];
    });
  });
};
console.log(cart);

///////////////////////////////////////////////////
// FOR API CALL & RENDER PIZZA

async function showApi() {
  try {
    const response = await fetch(api);
    const data = await response.json();

    renderPizzaMarkup(data);

    // Sort By catagory
    sortByLink(data);

    // Sort by option
    sortingPizza(data);

    // popup and button
    buttonAndPopup(data);
  } catch (err) {
    console.log(err);
  }
}

overlay.addEventListener("click", () => {
  hide();
});

// console.log(JSON.parse(localStorage.getItem("cartItem")));

// window.addEventListener("unload", () => {
//   localStorage.removeItem("cartItem");
// });

showApi();
