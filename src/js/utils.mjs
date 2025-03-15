
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position,
  clear = false,
) {

  if (clear) {
    parentElement.innerHTML = "";
  }
  if (list.length === 0) {
    parentElement.insertAdjacentHTML(position, templateFn());
  } else {
    position = "afterbegin";
    const htmlStrings = list.map(templateFn);
    parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
  }
}

export function renderWithTemplate(templateFn, parentElement, data, callback) {
  parentElement.insertAdjacentHTML("afterbegin", templateFn);
  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}


export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const header = document.querySelector("#header");
  const footer = document.querySelector("#footer");

  renderWithTemplate(headerTemplate, header);
  renderWithTemplate(footerTemplate, footer);

  searchProducts();

  cartSuperscript();
}

function searchProducts() {
  const sButton = document.getElementById("searchButton");
  sButton.addEventListener("click", function (e) {
    const searchTerm = document.getElementById("searchInput").value;

    performSearch(searchTerm);
  });
}

export function performSearch(term) {
  console.log("Performing search for:", term);

  const searchParams = new URLSearchParams();
  searchParams.append("category", term);

  const baseUrl = `${window.location.origin}/`;
  console.log("Base URL:", baseUrl);

  const newUrl = `product-listing/index.html?${searchParams.toString()}`;
  console.log("New URL:", newUrl);

  window.location.href = baseUrl + newUrl;
}

export function cartSuperscript() {
  const cartCountElement = document.querySelector(".cart .cart-superscript");

  const cartItems = getLocalStorage("so-cart") || [];
  const numCartItems = cartItems.reduce((acc, item) => acc + item.Qtd, 0);

  if (numCartItems === 0) {
    cartCountElement.classList.add("hide");
  } else {
    cartCountElement.classList.remove("hide");
    cartCountElement.textContent = numCartItems;

    cartCountElement.classList.add("updated");
  }
  setTimeout(() => {
    cartCountElement.classList.remove("updated");
  }, 300);
}
