import { getLocalStorage, setLocalStorage, cartSuperscript } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {};
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    this.updateBreadcrumbs();
    this.setupAddToCartListener();
  }

  addToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    const existingItemIndex = cartItems.findIndex(
      (item) => item.Id === this.product.Id,
    );

    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].FinalPrice += this.product.FinalPrice;
      cartItems[existingItemIndex].Qtd += 1;
    } else {
      this.product.Qtd = 1;
      cartItems.push(this.product);
    }

    setLocalStorage("so-cart", cartItems);
    cartSuperscript();
  }

  updateBreadcrumbs() {
    const breadcrumbsElement = document.querySelector("#breadcrumbs");
    breadcrumbsElement.innerHTML = `<span class="path">${this.product.Category}</span>`;
  }

  renderProductDetails() {
    const discountPercentage =
      ((this.product.SuggestedRetailPrice - this.product.ListPrice) /
        this.product.SuggestedRetailPrice) *
      100;
    const detailsElement = document.querySelector(".product-detail");
    detailsElement.innerHTML = `
      <h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      <img class="divider" src="${this.product.Images.PrimaryLarge}" alt="${this.product.Name}"/>
      <p class="product-card__price">
        <span class="product-card__original-price">$${this.product.SuggestedRetailPrice.toFixed(
          2,
        )}</span>
        <span class="product-card__discount-price">$${this.product.ListPrice}</span>
        <div class="discount-flag">
          <span>Save ${discountPercentage.toFixed(0)}%</span>
        </div>
      </p>
      <p class="product__color">${this.product.Colors[0].ColorName}</p>
      <p class="product__description">${this.product.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>
    `;
  }

    setupAddToCartListener() {
        document.getElementById("addToCart").addEventListener("click", () => this.addToCart());
    }
}