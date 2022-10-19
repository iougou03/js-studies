import { assign, createMachine } from "xstate";

const enum redditEventType {
  SELECT = "SELECT",
}

const selectEvent = {
  type: "SELECT",
  name: "reactjs",
};

const redditMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCdIQJYBcDEBlAogDL4DCAKgNoAMAuoqAA4D2sW6TAdvSAB6IC0AJioA6AMwBGQQFYANCACeAiQBYVAX03yOTCHG6oIGTCPQQANmG7NWmdlyS8BgsQHZ5ShPxUAOLSENjEVgwSwBjTEhrFjZObj4vGQ8BX39ArGjbe3jnHzlFZzFBTU0gA */
  createMachine({
    tsTypes: {} as import("./reddit.typegen").Typegen0,
    schema: {
      events: {} as { type: "SELECT"; name: string },
    },
    context: {
      subreddit: null,
    },
    predictableActionArguments: true,
    on: {
      SELECT: {
        target: ".selected",
        actions: assign({
          subreddit: "select name",
        }),
      },
    },
    initial: "idle",
    states: {
      idle: {},
      selected: {},
    },
    id: "reddit",
  }, {
    actions: {
      "select name": (context, event) => event.name;
    }
  });
