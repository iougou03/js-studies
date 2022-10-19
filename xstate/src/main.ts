import { css, CSSResultGroup, html, LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { IData, redditMachine } from "./reddit";
import { interpret } from "xstate";

import styles from "./style.scss";

const subredditsCandi = ['frontend', 'reactjs', 'vuejs'];

@customElement('app-main')
class App extends LitElement {
	private _state;

	private _service = interpret(redditMachine);

	static get styles() {
		return css`
			${unsafeCSS(styles)}
		`;
	}

	@state()
	subreddit: string | null;

	@state()
	posts: Array<IData> | null;

	constructor() {
		super();
		
		this._service.onTransition(state => {
			this._state = state;

			this.subreddit = state.context.subreddit;
			this.posts = state.context.posts;
		})
		.start();

		this._state = this._service.initialState;
		this.subreddit = subredditsCandi[0];
		this.posts = null;

		this._service.send({ type: 'SELECT', name: this.subreddit! });
	}

	handleSelectChange(e: Event) {
		const target = e.currentTarget as HTMLInputElement;

		this._service.send({ type: 'SELECT', name: target.value });
	}

	render() {
		return html`
			<main>
				<header>
					<select
						.value=${this.subreddit}
						@change=${this.handleSelectChange}
						>
						${subredditsCandi.map(r => html`<option key=${r}>${r}</option>`)}
						</select>
				</header>
				<section>
					<h1>
						${this._state.matches('idle') ? 'Select a subreddit' : this.subreddit}
					</h1>
					${this._state.matches({ selected: 'loading' }) ? html`<div>Loading...</div>`: ''}
					${this._state.matches({ selected: 'loaded'}) ? html`
						<ul>
							${this.posts?.map(post => html`<li key=${post.data.title}>${post.data.title}</li>`)}
						</ul>
					`: ''}
				</section>
			</main>
		`;
	}
}