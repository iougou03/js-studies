// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.fetch-subreddit": {
      type: "done.invoke.fetch-subreddit";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    "change name": "SELECT";
    "update data": "done.invoke.fetch-subreddit";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | "idle"
    | "selected"
    | "selected.failed"
    | "selected.loaded"
    | "selected.loading"
    | { selected?: "failed" | "loaded" | "loading" };
  tags: never;
}
