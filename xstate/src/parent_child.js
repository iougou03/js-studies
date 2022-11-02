import { send, sendParent } from "xstate/lib/actions";
import { createMachine, assign, spawn, interpret } from "xstate";

export const remoteMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCcwFsD2AXMA6DAZgQDYCWAdmAMQDqAggNICiA2gAwC6ioADhrKSykM5biAAeiAKy4AjACYpAGhABPRLIAs83FIC+elakw585MpSqlYAAlhYAhjhtoHFRxQD87LkhB8BIRExSQR5eQB2XAiADgVlNQ0pNgMjdGw8EQtqVCwAV2RyHzEAwWFRP1DZNhlZGIiE9QRNCINDEHIMCDgxYwz8ImyS-jLgysQAWgBOTRUmrQBmVJA+0yyKMGHA8pCNWSjqqYWGuaS2XWXVvEpxLDtHHC3RitBQzVlZOXrGs4v2q6eQReEkmWnkpwQE20bT0QA */
  createMachine({
    id: "remote",
    initial: "offline",
    states: {
      offline: {
        on: {
          WAKE: {
            target: "online",
          },
        },
      },
      online: {
        on: {
          "is state maintain?": {
            target: "next state",
          },
          return: {
            target: "online",
            actions: sendParent("REMOTE.ONLINE"),
            internal: false,
          },
        },
      },
      "next state": {
        entry: () => console.log("[child]: I\\'ve entered to next state"),
      },
    },
  });

export const parentMachine = createMachine({
  id: "parent",
  initial: "waiting",
  context: {
    localOne: null,
  },
  states: {
    waiting: {
      entry: assign({
        localOne: () => spawn(remoteMachine),
      }),
      on: {
        "LOCAL.WAKE": {
          actions: [
            send({ type: "WAKE" }, { to: (context) => context.localOne }),
            send({ type: "return" }, { to: (context) => context.localOne }),
          ],
        },
        "REMOTE.ONLINE": {
          target: "connected",
        },
      },
    },
    connected: {
      on: {
        "Send next event": {
          target: "#parent.connected",
          actions: send(
            { type: "is state maintain?" },
            { to: (context) => context.localOne }
          ),
          internal: true,
        },
      },
    },
  },
});
