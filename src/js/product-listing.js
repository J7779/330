import { loadHeaderFooter, getParam, performSearch } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category");


const dataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");


const productListing = new ProductList(category, dataSource, listElement);
productListing.init();
