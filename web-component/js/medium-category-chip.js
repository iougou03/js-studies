const css = `
<style>
// * hidden *
</style>
`;

const template = document.createElement("template");
template.innerHTML += `
    ${css}
    <div class="chip card-category"><slot></slot></div>
`;

class MediumCategoryChip extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("medium-category-chip", MediumCategoryChip);