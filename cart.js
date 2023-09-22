const cartContainer = document.querySelector(".cart");
const totalPrice = document.querySelector(".cart__footer-total span");

const cart = JSON.parse(localStorage.getItem("cartItem"));

let priceArr = [];
let price = 0;

const renderCartMarkup = function (data) {
  const allOrders = data.details
    .map((i) => {
      price += i.price;
      return `
    <div class="cart__body-text-order">
                <p>${i.size}</p>
                <p>${i.topping.map((j) => {
                  return j;
                })}</p>
                <p>${i.price}</p>
              </div>
    `;
    })
    .join("");
  return `
        <div>
        <div class="cart__body">
            <div class="cart__body-img">
              <img src="${data.img}" alt="${data.name}" />
            </div>
            <div class="cart__body-text cart__body-text-header">
              <h3 class="cart__body-text-heading">${data.name}</h3>

              <div class="cart__body-text-subheading">
                <p>size</p>
                <p>Toppings</p>
                <p>price</p>
              </div>

              ${allOrders}

              <div class="cart__body-text-total">
                <h4>total : rs <span>${data.details.reduce((acc, i) => {
                  return acc + i.price;
                }, 0)}</span></h4>
              </div>
            </div>
          </div>
          </div>

        </div>
        </div>
  `;
};

function renderData() {
  const html = Object.entries(cart)
    .map((i) => {
      return renderCartMarkup(i[1]);
    })
    .join(",");
  cartContainer.insertAdjacentHTML("beforeend", html);
  totalPrice.textContent = price;
  price = 0;
}

renderData();
