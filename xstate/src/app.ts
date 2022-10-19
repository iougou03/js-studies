import { interpret } from "xstate";
import { customElement, property, state } from "lit/decorators.js";
import { css, html, LitElement } from "lit";
import { ParallelState } from "./store";
import "./child";

const { initialState } = ParallelState;
ParallelState.transition(initialState, { type: 'Unmute'}).actions = [
  {
    type: 'Mute microphone',
    exec: () => {
      console.log("override actions functions where had defined in createMachine()")
    }
  }
]

export const machine = interpret(ParallelState);
machine.start();

@customElement('app-')
class App extends LitElement{

  static styles = css`
    pre {
      margin-bottom: 2rem;
    }
  `;

  @state()
  _state:any;

  constructor() {
    super();
    
    machine.onTransition(data => {
      this._state = data;
    })
  }
  
  render() {
    return html`
      <h1>Xstate practice</h1>
      <a href="https://www.youtube.com/watch?v=2eurRx-tR-I&ab_channel=MattPocock" target="_blank">
        course link
      </a>
      <div id="app">
      <pre>
        ${JSON.stringify(
          {
            value: this._state.value,
            context: this._state.context
          },
          null,
          2
        )}
      </pre>
      </div>

      ${machine.state.nextEvents.map((event) => (
        html`
        <button 
          style="display:block; margin-bottom:1rem"
          @click=${() => {
            machine.send({ 'type': event })
            this._handleClick();
          }}
          >
          ${ event }
        </button>
        `
      ))}

      <app-child
        .machineValue = ${this._state.value}
      ></app-child>
    `;
  }

  _handleClick() {
    console.log(
      JSON.stringify(
        this.shadowRoot?.querySelector('app-child')?.getAttribute('machineValue'), null, 2
      ));
  }
}

window.onload = () => {
  new App();
}