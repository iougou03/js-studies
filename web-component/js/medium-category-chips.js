import { decodeObject } from "./helper.js";
import "./medium-category-chip.js";

const css = ``;
class MediumCategoryChips extends HTMLElement {
  get categories() {
    return decodeObject(this.getAttribute("categories"));
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
    ${css}
    <div class="chips">
    ${this.categories
      .map(
        (category) => `<medium-category-chip>${category}</medium-category-chip>`
      )
      .join("")}       
    </div>
    `;
  }
}

customElements.define("medium-category-chips", MediumCategoryChips);