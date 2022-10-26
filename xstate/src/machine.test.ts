import { assert } from 'chai';
import { interpret } from "xstate"

import { createSubredditMachine, redditMachine } from "./machine";


describe('reddit machine (live)', () => {
	it('[machine 2]: should load posts of a selected subreddit', (done) => {
		const redditService = interpret(createSubredditMachine('reactjs'))
			.onTransition(state => {

				if (state.matches('loaded')) {

					assert.isNotEmpty(state.context.posts);

					done();
				}
			})
			.start();
	});
});