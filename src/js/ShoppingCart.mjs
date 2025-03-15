import {
  getLocalStorage,
  setLocalStorage,
  cartSuperscript,
} from "./utils.mjs";

function createCartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Images.PrimarySmall}" alt="${item.Name}"/>
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <div class="qtd-container">
        <div class="qtd-button" id="qtdUp" data-id="${item.Id}">+</div>
        <p class="cart-card__quantity">qty: ${item.Qtd}</p>
        <div class="qtd-button" id="qtdDown" data-id="${item.Id}">-</div>
      </div>
      <p class="cart-card__price">$${item.FinalPrice.toFixed(2)}</p>
      <div class="cart-item-buttons">
        <button class="cart-card__remove" data-id="${item.Id}">X</button>
        <button class="to-wishlist-button" data-id="${item.Id}">Move to Wishlist</button>
      </div>
    </li>
  `;
}

function createWishlistItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Images.PrimarySmall}" alt="${item.Name}"/>
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <button class="to-cart-button" data-id="${item.Id}">Move to Cart</button>
    </li>
  `;
}

export default class ShoppingCart {
  constructor() {}

  renderCartContents() {
    const cartItems = getLocalStorage("so-cart") || [];
    this.renderWishlist();

    const productList = document.querySelector(".product-list");

    if (cartItems.length === 0) {
      productList.innerHTML = "<p>Your cart is empty.</p>";
      this.updateCartSubtotal(cartItems);
      return;
    }

    productList.innerHTML = cartItems
      .map(createCartItemTemplate)
      .join("");

    this.setupCartItemListeners(cartItems);
    this.updateCartSubtotal(cartItems);
  }


  renderWishlist() {
    const wishlistItems = getLocalStorage("wishlist") || [];
    const wishlistElement = document.querySelector(".wishlist-items");

    if (wishlistItems.length === 0) {
      wishlistElement.innerHTML = "<p>Your wishlist is empty</p>";
      return;
    }

    wishlistElement.innerHTML = wishlistItems
      .map(createWishlistItemTemplate)
      .join("");

    this.setupWishlistListeners();
  }
    setupCartItemListeners(cartItems){
        document.querySelectorAll(".cart-card__remove").forEach((button) => {
            button.addEventListener("click", (event) => this.removeCartItem(event));
          });
      
          document.querySelectorAll("#qtdDown").forEach((button) => {
            button.addEventListener("click", (event) => this.decreaseQuantity(event));
          });
      
          document.querySelectorAll("#qtdUp").forEach((button) => {
            button.addEventListener("click", (event) => this.increaseQuantity(event));
          });
      
          document.querySelectorAll(".to-wishlist-button").forEach((button) => {
            button.addEventListener("click", (event) => this.moveToWishlist(event));
          });
    }

    setupWishlistListeners(){
        document.querySelectorAll(".to-cart-button").forEach((button) => {
            button.addEventListener("click", (event) => this.moveToCart(event));
          });
    }

  decreaseQuantity(event) {
    const itemId = event.currentTarget.dataset.id;
    const cartItems = getLocalStorage("so-cart");
    const itemIndex = cartItems.findIndex((item) => item.Id === itemId);

    if (cartItems[itemIndex].Qtd === 1) {
      this.removeCartItem(event);
    } else {
      cartItems[itemIndex].Qtd -= 1;
      cartItems[itemIndex].FinalPrice -= cartItems[itemIndex].ListPrice;
      setLocalStorage("so-cart", cartItems);
      this.renderCartContents();
    }
  }

  increaseQuantity(event) {
    const itemId = event.currentTarget.dataset.id;
    const cartItems = getLocalStorage("so-cart");
    const itemIndex = cartItems.findIndex((item) => item.Id === itemId);

    cartItems[itemIndex].Qtd += 1;
    cartItems[itemIndex].FinalPrice += cartItems[itemIndex].ListPrice;
    setLocalStorage("so-cart", cartItems);
    this.renderCartContents();
  }

  removeCartItem(event) {
    const itemId = event.currentTarget.dataset.id;
    const cartItems = getLocalStorage("so-cart");
    const updatedCart = cartItems.filter((item) => item.Id !== itemId);
    setLocalStorage("so-cart", updatedCart);
    cartSuperscript();
    this.renderCartContents();
  }

  updateCartSubtotal(items) {
    const cartCard = document.querySelector(".cart-card__subtotal");
    if (items.length === 0) {
      cartCard.classList.add("hide");
    } else {
      cartCard.classList.remove("hide");
      const subtotal = items.reduce((acc, item) => acc + item.FinalPrice, 0);
      const cartCount = items.reduce((acc, item) => acc + item.Qtd, 0);
      document.querySelector(".cart-count").textContent =
        `${cartCount} item${cartCount > 1 ? "s" : ""}`;
      document.querySelector(".cart-subtotal").textContent =
        ` $${subtotal.toFixed(2)}`;
    }
  }

  moveToWishlist(event) {
    const itemId = event.currentTarget.dataset.id;
    const cartItems = getLocalStorage("so-cart");
    const wishlistItems = getLocalStorage("wishlist") || [];
    const itemIndex = cartItems.findIndex((item) => item.Id === itemId);

    wishlistItems.push(cartItems[itemIndex]);
    setLocalStorage("wishlist", wishlistItems);

    const updatedCart = cartItems.filter((item) => item.Id !== itemId);
    setLocalStorage("so-cart", updatedCart);

    cartSuperscript();
    this.renderCartContents();
  }
  
  moveToCart(event) {
    const itemId = event.currentTarget.dataset.id;
    const cartItems = getLocalStorage("so-cart") || [];
    const wishlistItems = getLocalStorage("wishlist");
    const itemIndex = wishlistItems.findIndex((item) => item.Id === itemId);

    cartItems.push(wishlistItems[itemIndex]);
    setLocalStorage("so-cart", cartItems);

    const updatedWishlist = wishlistItems.filter((item) => item.Id !== itemId);
    setLocalStorage("wishlist", updatedWishlist);

    cartSuperscript();
    this.renderCartContents();
  }
}