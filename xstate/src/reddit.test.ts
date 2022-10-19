import { assert } from 'chai';
import { interpret } from "xstate"

import { redditMachine } from "./reddit";


describe('reddit machine (live)', () => {
	it('should load posts of a selected subreddit', (done) => {
		const redditService = interpret(redditMachine)
			.onTransition(state => {


				if (state.matches({ selected: 'loaded' })) {

					assert.isNotEmpty(state.context.posts);

					done();
				}
			})
			.start();

		redditService.send({ type: 'SELECT', name: 'reactjs' });
	});
});