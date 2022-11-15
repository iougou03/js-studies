// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "done.invoke.db.Online.delete saved window:invocation[0]": {
      type: "done.invoke.db.Online.delete saved window:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.db.Online.save window:invocation[0]": {
      type: "done.invoke.db.Online.save window:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.db.Online.delete saved window:invocation[0]": {
      type: "error.platform.db.Online.delete saved window:invocation[0]";
      data: unknown;
    };
    "error.platform.db.Online.save window:invocation[0]": {
      type: "error.platform.db.Online.save window:invocation[0]";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    "delete saved window": "done.invoke.db.Online.delete saved window:invocation[0]";
    "save window": "done.invoke.db.Online.save window:invocation[0]";
  };
  missingImplementations: {
    actions: "fm2ghi" | "k22m37";
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    fm2ghi: "xstate.init";
    k22m37: "" | "open";
    "open idb": "open";
    "send status":
      | "done.invoke.db.Online.delete saved window:invocation[0]"
      | "done.invoke.db.Online.save window:invocation[0]"
      | "error.platform.db.Online.delete saved window:invocation[0]"
      | "error.platform.db.Online.save window:invocation[0]";
    "send to parent":
      | "done.invoke.db.Online.delete saved window:invocation[0]"
      | "done.invoke.db.Online.save window:invocation[0]"
      | "error.platform.db.Online.delete saved window:invocation[0]"
      | "error.platform.db.Online.save window:invocation[0]";
  };
  eventsCausingServices: {
    "delete saved window": "" | "REQUEST" | "open";
    "save window": "" | "REQUEST" | "open";
  };
  eventsCausingGuards: {
    "delete saved windows": "REQUEST";
    "save window": "REQUEST";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "Error"
    | "Offline"
    | "Online"
    | "Online.delete saved window"
    | "Online.save window"
    | "Success"
    | { Online?: "delete saved window" | "save window" };
  tags: never;
}
export interface Typegen1 {
  "@@xstate/typegen": true;
  internalEvents: {
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
    "receive data": "REMOTE.RECEIVE";
    "request db with data": "LOCAL.REQUEST";
    "request open db": "LOCAL.OPEN";
    "send to message machine": "messaging";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    "delete saved window": "LOCAL.REQUEST";
    "get all saved window": "LOCAL.REQUEST";
    "save window": "LOCAL.REQUEST";
  };
  eventsCausingDelays: {};
  matchesStates: "Connected to db" | "Send to message" | "idle";
  tags: never;
}
