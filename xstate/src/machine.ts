import { assign, createMachine } from "xstate"
export interface IData {
	data: {
		title: string
	}
}

export interface IRedditData {
	kind: string,
	data: {
		children: Array<IData>
	}
}

async function invokeFetchSubreddit(context: IRedditContext) {
	const { subreddit } = context;

	console.log(`https://www.reddit.com/r/${subreddit}.json`);
	return fetch(`https://www.reddit.com/r/${subreddit}.json`)
		.then(res => res.json())
		.then((json: IRedditData) => json.data.children);
}

const enum redditEventType {
	SELECT = "SELECT",
}

export interface IRedditContext {
	subreddit: string | null;
	posts: Array<IData> | null;
}

export const redditMachine =
	/** @xstate-layout N4IgpgJg5mDOIC5QCdIQJYBcDEBlAogDL4DCAKgNoAMAuoqAA4D2sW6TAdvSAB6ICMAVgDMAOgAcANkH8A7JP7jZATnH9hggDQgAngIAsYycOFVx+-fwBMyyZOVWAvs+0cmEON1QQMmUeggAGzBuZlZMdi4kXkRJKm09BGVlUWS0-mtBKitxYX0XEG9fUVgwYIBjTEhQljZObj4EOITEK2FJUSourv59SXFBZVkRAqKsGvDIhoErFoRrZ2cgA */
	createMachine({
		predictableActionArguments: true,
		tsTypes: {} as import("./machine.typegen").Typegen0 ,
		schema: {
			context: {} as {
				subreddit: string
			},
			events: {} as { type: "SELECT"; name: string }
		},
		on: {
			SELECT: {
				target: ".selected",
				actions: "change name"
			},
		},
		initial: "idle",
		states: {
			idle: {},
			selected: {},
		},
		id: "reddit",
		context: {
			subreddit: ''
		}
	}, {
		actions: {
			"change name": (context, event) => {
				context.subreddit = event.name;
			},
		}
	})


export interface IRedditContext2 {
	subreddit: string,
	posts:  Array<IData> | null,
	lastUpdated: number | null
}
export const createSubredditMachine = (subreddit: string) =>
	/** @xstate-layout N4IgpgJg5mDOIC5SwK4CMBOkIEsAuAdADYD2AhrgHZQDEEJlYBOlAbiQNZMBmYeAxgAsAtKkzZ8AbQAMAXUSgADiVj4cDBSAAeiACy7pBAOwBGABxGArABoQAT0QAmAMxmAvm9tisEXIVIULLRgGBgkGASKRGR43OEAtgS8AiLeEngy8kggyqp46pSaOgj6hqYWNvaIJs66Hl7oPn7E5BCQNABKAKIAYt0AygASmZq5ahrZxZa1BACcZrrOVrYOCOYAbPUgab74SWQ4RChYnV0AKh0AmiPZY-kToFOW6wTSuusVK4hmjh6eIJQSG14Nkds0AlQoKMVONCpNEMJnCYvggjEYCHV-mC9hDINC8gUioh1utLARno5KqsTLNdAQzM5GUzmYyTFtsYRuAcjlh8bCiQgSWSKVTELNDAyWVLnOzGuk+fc4Y8EUZZijhCZDJZZjrdXrdZiPEA */
	createMachine({
		schema: {
			context: {} as IRedditContext2,
			events: {} as
				| { type: 'done.invoke.fetch-subreddit'; data: Array<IData> }
				| { type: 'REFRESH' }
				| { type: 'RETRY' },
		},
		context: {
			subreddit,
			posts: null,
			lastUpdated: null
		},
		tsTypes: {} as import("./machine.typegen").Typegen1,
		initial: "loading",
		states: {
			loading: {
				invoke: {
					id: "fetch-subreddit",
					src: invokeFetchSubreddit,
					onDone: [
						{
							target: "loaded",
							actions: 'update context'
						},
					],
					onError: [
						{
							target: "failure",
						},
					],
				},
			},
			loaded: {
				on: {
					REFRESH: {
						target: "loading",
					},
				},
			},
			failure: {
				on: {
					RETRY: {
						target: "loading",
					},
				},
			},
		},
		id: "subreddit",
	}, {
		actions: {
			'update context': (context, event) => {
				context.posts = event.data;
				context.lastUpdated = Date.now();
			}
		}
	});