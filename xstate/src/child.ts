import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement('app-child')
class Child extends LitElement{
  @state({
    
  })
  machineValue

  constructor() {
    super();

    this.machineValue = this.getAttribute('machineValue');
    
  }
  render() {
    console.log("child", this.machineValue)
    return html`
      <h1>Child</h1>
      <pre>
      ${JSON.stringify(
        this.machineValue,
        null,
        2
      )}
      </pre>
    `;
  }
}