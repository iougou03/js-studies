import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ParallelState } from "./store";
import { interpret } from "xstate";

const machine = interpret(ParallelState);

machine.start();

@customElement('app-other')
class App extends LitElement {

  @state()
  _value;

  constructor() {
    super()

    this._value = machine.state.value;
    machine.onTransition((data) => {
      this._value = data.value;
    })
  }

  render() {
    return html`
    <h1>Check State here</h1>
    <pre>
      <p>${ JSON.stringify(
        this._value,
        null,
        2
      ) }</p>
    </pre>
    `;
  }
}

window.onload = () => {
  new App();
}