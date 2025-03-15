
import { loadHeaderFooter } from "./utils.mjs";
import Modal from "./modal.mjs";

loadHeaderFooter();

const title = "🎁 Register Now & Win! 🎁";
const message =
  "Sign up on your first visit and get a chance to win premium camping gear – tents, sleeping bags, and more! 🏕️";
const modal = new Modal(title, message, true);
modal.ShowModal();




