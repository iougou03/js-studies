import { assign, AssignAction, createMachine } from "xstate";

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

export type RedditEvents =
  | { type: "SELECT"; name: string }
  | { type: 'done.invoke.fetch-subreddit'; data: Array<IData> };

export type RedditTypeStates =
  | {
    value: 'idle';
    context: IRedditContext
  }
  | {
    value: 'selected';
    context: IRedditContext & {
      subreddit: null,
      posts: null
    }
  }
  | {
    value: { selected: 'loading' };
    context: IRedditContext
  }
  | {
    value: { selected: 'loaded' };
    context: IRedditContext
  }
  | {
    value: { selected: 'failed' };
    context: IRedditContext
  }

export const redditMachine =

  /** @xstate-layout N4IgpgJg5mDOIC5QCdIQJYBcB0swBswBjTSbfAewEMMA7KAYggtrG3VoDcKBrNgMzCYiACwC0sAK4AjVBAyYA2gAYAuolAAHCrCzoWGkAA9EAFmUBGbAA4ArAE5zDiwGZT9+9YA0IAJ6ILWxdsDw9rexdlaxcAJhjHAF8EnzkFXAJiUghyajpGMGRkCmRsTXwqTH5igFtsQWFxKVk0LBV1JBBtXUx9WkMTBHMrO0dlZzcwn38EGNcQ0NMYgHYANhjlJfiklJbMBgBlAFEAGUOAYQAVNsMuvQMOgcWpgNNTbBWPldtTJcCx6wBSWSIFoFAgcEMqSw7AghBuOjufQeZhizwQ1jeny+FkWFji9gs9m2IChODwhBIZEoNA4UHh3V6-UQMRc1mwS1symUs1i9m5plZaIsHJsLliSyW4SCkoxxNJ6QpWRyNEg9MRTIQaxW7OULjxrPsMVsFg+Qu+2E5XJcBNMGO5SzluwVmTI-Co6EIEDVPXuoAGWp1epZ4SNJpWaNmb3coRiK25gVjMUd8mh5JdXo6tx9SL9AT57MtPPi-MFfkQKzeoQ8pi+phNOIdwNJ3sZyIQYnDZfbLPmVb7oRcQISQA */
  createMachine({
    context: {
      subreddit: null,
      posts: null
    },
    tsTypes: {} as import("./reddit.typegen").Typegen0,
    schema: {
      context: {} as IRedditContext,
      events: {} as RedditEvents
    },
    predictableActionArguments: true,
    initial: "idle",
    states: {
      idle: {},
      selected: {
        initial: "loading",
        states: {
          loading: {
            invoke: {
              src: invokeFetchSubreddit,
              id: "fetch-subreddit",
              onDone: [
                {
                  target: "loaded",
                  actions: 'update data'
                },
              ],
              onError: [
                {
                  target: "failed",
                },
              ],
            },
          },
          loaded: {},
          failed: {},
        },
      },
    },
    id: "reddit",
    on: {
      SELECT: {
        target: ".selected",
        actions: "change name",
      },
    },
  }, {
    actions: {
      "change name": (context, event) => {
        context.subreddit = event.name;
      },

      "update data": (context, event) => {
        context.posts = event.data;
      }
    }
  });
