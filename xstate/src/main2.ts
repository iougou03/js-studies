import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { createSubredditMachine, IRedditContext, IRedditContext2, redditMachine } from "./machine";
import { interpret } from "xstate";

const subredditsCandi = ['frontend', 'reactjs', 'vuejs'];


@customElement("app-subreddit")
class Subreddit extends LitElement {
  @property()
  name: string;

  private _service: any;

  @state()
  private _state: any;
  
  @state()
  private _context!: IRedditContext2;

  constructor() {
    super();

    this.name = '';

    this._service = interpret(createSubredditMachine(this.name))
    .onTransition(state => {
      this._state = state;
      this._context = {...state.context};

      console.log(this._state);
    })
    .start();
    
    this._state = this._service.initialState;
    this._context = this._state.context;
  }

  handleButton(type: "RETRY" | "REFRESH") {
    this._service.send(type);
  }

  render() {

    if (this._state.matches("failure")) {
      return html`
        <div>
          Failed to load posts.${" "}
          <button @click=${() => this.handleButton("RETRY")}>Retry?</button>
        </div>
      `;
    } else {
      return html`
        <section
          data-machine=${this._service.id}
          data-state=${this._state.toStrings().join(" ")}
        >
          ${this._state.matches("loading")
            ? html`<div>Loading posts</div>`
            : ""}
          ${this._context.posts
            ? html`
                <header>
                  <h2>${this._context.subreddit}</h2>
                  <small>
                    Last updated: ${this._context.lastUpdated} ${" "}
                    <button @click=${() => this.handleButton("REFRESH")}>
                      Refresh
                    </button>
                  </small>
                </header>
                <ul>
                  ${repeat(
                    this._context.posts,
                    (post) => post.data.title,
                    (post) => html`<li>${post.data.title}</li>`
                  )}
                </ul>
              `
            : ""}
        </section>
      `;
    }
  }
}

@customElement("app-")
class App extends LitElement {
  private _service;
  @state()
  private _state;

  private _context;

  @state()
	subreddit: string = '';

  constructor() {
    super();

    this._service = interpret(redditMachine)
      .onTransition(state=> {
        this._state = state;
        this._context = state.context;
        this.subreddit = this._context.subreddit;
      })
      .start();

    this._state = this._service.initialState;
    this._context = this._state.context;
    this.subreddit = subredditsCandi[0];
  }

  handleSelectChange(e: Event) {
		const target = e.currentTarget as HTMLInputElement;

    this.subreddit = target.value;
		this._service.send({ type: 'SELECT', name: target.value });
	}

  render() {
    return html`
      <main>
        <header>
          <select .value=${this._context.subreddit} @change=${this.handleSelectChange}>
            ${subredditsCandi.map((r) => html`<option key=${r}>${r}</option>`)}
          </select>
        </header>
        ${this.subreddit ? html`<app-subreddit .name=${this.subreddit}></app-subreddit>` : ''}
      </main>
    `;
  }
}



document.body.appendChild(document.createElement('app-'));