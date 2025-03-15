import { renderListWithTemplate } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductModal from "./ProductModal.mjs";

function createProductCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}" />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.Name}</h2>
        <p class="product-card__price">
          <span class="product-card__original-price">$${product.SuggestedRetailPrice.toFixed(
            2,
          )}</span>
          <span class="product-card__discount-price">$${product.ListPrice}</span>
        </p>
      </a>
      <button class="button--small quickViewBtn" data-id="${product.Id}">Quick View</button>
    </li>`;
}

function createErrorTemplate() {
  return `
    <div class="product-error">
      <p>Sorry, we could not find that product. Please try again.</p>
    </div>`;
}

export default class ProductListing {
  constructor(category, dataSource, listElement) {
    this.products = [];
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  filterAvailableProducts(products) {
    return products.filter((product) => product.Available);
  }

  sortProducts(products, criteria) {
    if (criteria === "name") {
      return [...products].sort((a, b) => a.Name.localeCompare(b.Name));
    } else if (criteria === "price") {
      return [...products].sort((a, b) => a.FinalPrice - b.FinalPrice);
    }
    return products;
  }

  renderProductList(products) {
    this.listElement.innerHTML = "";
    if (products.length === 0) {
      renderListWithTemplate(
        createErrorTemplate,
        this.listElement,
        products,
        "afterend",
        false,
      );
    } else {
      renderListWithTemplate(
        createProductCardTemplate,
        this.listElement,
        products,
      );
    }
     this.setupQuickViewListeners();
  }

    setupQuickViewListeners() {
    const quickViewButtons = document.querySelectorAll(".quickViewBtn");
    quickViewButtons.forEach((button) => {
      button.addEventListener("click", (event) => this.openQuickView(event));
    });
  }

  updateBreadcrumbs() {
    const breadcrumbsElement = document.querySelector("#breadcrumbs");
    breadcrumbsElement.innerHTML = `
      <span class="path">${this.category}</span>
      <span class="arrow">></span>
      <span class="path">(${this.products.length} items)</span>
    `;
  }
    openQuickView(event) {
        const productId = event.currentTarget.dataset.id;
        const dataSource = new ExternalServices();
        const modal = new ProductModal(productId, dataSource);
        modal.init();
    }
  async init() {
    const products = await this.dataSource.getData(this.category);
    this.products = products;
    this.renderProductList(products);
    this.setupSortListener(products);
    this.updatePageTitle();
    this.updateBreadcrumbs();
   
  }
    setupSortListener(products){
        const sortElement = document.getElementById("sort");
        sortElement.addEventListener("change", (event) => {
        const sortedProducts = this.sortProducts(products, event.target.value);
        this.renderProductList(sortedProducts);
        });
    }

    updatePageTitle(){
        const title = this.category.charAt(0).toUpperCase() + this.category.slice(1);
        document.querySelector(".title").innerHTML = title;
    }
}