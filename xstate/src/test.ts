import { assign, createMachine, interpret, spawn, actions } from "xstate";
import { respond, send } from "xstate/lib/actions";

interface CurrentWindowMapping {
  [windowId: number]: object;
}

const enum ChromeEventType {
  WINDOW_CREATED = "WINDOW_CREATED",
  WINDOW_CLOSED = "WINDOW_CLOSED",
  TAB_CREATED = "TAB_CREATED",
  TAB_UPDATED = "TAB_UPDATED",
  TAB_MOVED = "TAB_MOVED",
  TAB_CLOSED = "TAB_CLOSED",
  ACTIVE_CHANGED = "ACTIVE_CHANGED",
}

interface IContext {
  data: CurrentWindowMapping;
  prevOccurWindowId: -1;
  prevOccurTabId: -1;
  occurWindowId: -1;
  occurTabId: -1;
}

const WorkerMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QHUD2AnA1mdA6ZAhgC4CWAdlAAQBmGlRBsmAxAMIAW6qAtmAKIA3MGSIAVAJ4AHMAG0ADAF1EoSalglSqMspAAPRACYArAA5cAFgDMAdiNyjBuQE4AjADYD5gDQhxiF5bmuE4hTtaeBk4mVrYAvrE+aFg4+MTkVLTo9IwsHFy8gsJiUrIuSkggquqa2hX6CMZmMXYOzu6ePn4NlpYWocauRuZG1m5G8YkY2HiEpBQ0dAxMbJw8-EIiEtIyBuUqahokWjr1jRY2LY6uHt6+iD0uwaHmciZuzga24wkgSdOpcwyixyK3y6yKW1klj2lQONROhlM51s9iu7VuXSscj6ISMpjkbksYWGE1+UxSs3SCyyS1yqwKG2K23MMKqh2OdURTQuqLaN06iAcZlCTg+TkcLhc5lJfwpaXmmWyyzya0KmxKMiMrLhR1qoFOSOavOuHTuCA81hx4vMBhs5hMLgM8R+ZFQEDgOllM3lQJpOR0bPhnIQNoFCCcblwNyirWsLgjJhl5LwABEAPIAOT4AZ1HP1iDGTlwBjGbnCck+o2GYcsSM8uJMeLx5nMTmlPy9OequoRCAAtG4w5bo43HHGE3IXM7YkA */
  createMachine(
    {
      tsTypes: {} as import("./test.typegen").Typegen0,
      schema: {
        context: {} as IContext,
        events: {} as {
          type: "ChromeEventType";
          command: ChromeEventType;
          context: IContext;
        },
      },
      predictableActionArguments: true,
      initial: "Wating for task",
      states: {
        "Wating for task": {
          entry: () => console.log("enter to worker"),
          on: {
            ChromeEventType: [
              {
                target: "DONE",
                cond: "WINDOW_CREATED",
                actions: "Push to windows list",
              },
              {
                target: "DONE",
                cond: "WINDOW_CLOSED",
                actions: "Remove from windows list",
              },
              {
                target: "DONE",
                cond: "TAB_CREATED",
                actions: "Push to tabs list",
              },
              {
                target: "DONE",
                cond: "TAB_UPDATED",
                actions: "Update tab in tabs list",
              },
              {
                target: "DONE",
                cond: "TAB_CLOSED",
                actions: "Remove from tabs list",
              },
              {
                target: "DONE",
                cond: "ACTIVE_CHANGED",
                actions: "Update tab's focus in tabs list",
              },
            ],
          },
        },
        DONE: {
          type: "final",
        },
      },
      id: "Worker",
    },
    {
      guards: {
        WINDOW_CREATED: (_, event) =>
          event.command === ChromeEventType.WINDOW_CREATED,
        WINDOW_CLOSED: (_, event) =>
          event.command === ChromeEventType.WINDOW_CLOSED,
        TAB_CREATED: (_, event) =>
          event.command === ChromeEventType.TAB_CREATED,
        TAB_UPDATED: (_, event) =>
          event.command === ChromeEventType.TAB_UPDATED,
        TAB_CLOSED: (_, event) => event.command === ChromeEventType.TAB_CLOSED,
        ACTIVE_CHANGED: (_, event) =>
          event.command === ChromeEventType.ACTIVE_CHANGED,
      },
      actions: {
        "Push to windows list": (context, event) => {
          console.log("[worker]: ", context, event);

          // respond({ type: "Success" });
        },

        "Remove from windows list": () => {},

        "Push to tabs list": () => {},

        "Update tab in tabs list": () => {},

        "Remove from tabs list": () => {},

        "Update tab's focus in tabs list": () => {},
      },
    }
  );

const CurrentWindowMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QGECuAndYB2AXABAO4CW2EA9ofgLYCGAxgBalgB0AMubRKVAMQVsbUgDdyAazZpMOAiTKUaDZkI5ce2KAlHl6tXMXLYA2gAYAumfOJQAB3KxiBozZAAPRAFoATAA4ALKwA7ACMAKwAnAFhQTER3gBsADQgAJ6IIUG+rKZhCWEAzFGF-qb+viEAvpUp0lh4RKQUVHRMLGrcvHxgmOTorLYANvoAZn3UrHWyjQotyu2cnZra2GJ6ziYWVq72jhuuHgieIVGsCUHeBeVBEaa+vhHhKelHIdnhpgUhmaZBpgkFSL+aq1DD1ORNRStFRsRYQSCsACSEEGYD4ACUwABHVBwAh6Qb0VDDAyabZIEC7JyGbAHLwhf7BIL5XwJBIVW4FC7PRClQLeCIRQqmEIFVlCkIJEEgKYNeTNJRtVRwhEAdT6knQAiMwlWEjYhA1PU80JY5LsDmpLgph2OEQKrAKTrFoSyWXuBR5CHO2QFBTu-m+CUevm80tlENmiphHXhEFY6vQmu6vX6Q1G41YhqTxtNQnNlMt+xtXn8-tYYW83y5Ire338YS9AO8FdMiRC-n8QpZYZqMrB03lUPmyvUaqNWoAKniC1Ti6BbVdAmFPlXwpcEt4BY20ohCg6bv6AkGQ73QTI5ZC5krYWP4wBlVD0ehwWB8WdFml0o4lYKRKLhJuIqmBEXr+LEFaSpkJzeGEdZVH2EYzAqea3twCIAGK0MQqIQO+Fg7J+1oLqWYSBMy5Rke2WTfGBEFwQk0HxHBFQduGA6XlGqGxpAfAAKJuE4H57F+JYIFuYTBN4gYMdWfghN4XpfC24FlN4QRlvEmSFOxF6RihI5sFhOG8ZiuDoKkwlWrSYnHH4OT+v8ZZfB6rJNg6zpXL4kRVlupRhNUfbYOQ8LwBSSFDteMZwrwhEicR7heJWLaealnlKREjrOpRWl+bp4LIcON48fGyKonF1nfj4vgHiuYTeX8JQKRlvqCsKorigx+WDle0YLHeCYThV86Ja8FStgUa6VgUm7bl6K6tUegaSqe3WcQZxUqg+T4vrAYUWvFNkkUcZZBH+uQNbkVzNbuCBBOWfoBiebxnv2emFVF-XofGxm4cNonHZ4DYJBWjEaQknaVgkIE7i8YSVsE-oNgGgLnK9EW9dxW3-Qltr1S2sSChUeTeMBoG3f6mUCkKZaVqE9XeWt+lFTG07oNQpD6GAONHaNylnE5YO5ACZFBEp3ysBEfydokUSmP8UqIRxzOfaov2QDz37jb88sMbcvjMvc7lZU6OW+dJuRMx9fVCJrtkAqYf5E4BpMMuTLzHL8rAfF8eROoULKBZUQA */
  createMachine(
    {
  tsTypes: {} as import("./test.typegen").Typegen1,
  schema: {
    context: {} as IContext,
    services: {} as {
      "Call all chrome windows": {
        // data: CurrentWindowMapping
        data: boolean;
      };
    },
    events: {} as
      | { type: "Request calculating"; command: ChromeEventType }
      | { type: "Exit" }
      | { type: "Retry" }
      | { type: "Test" },
    actions: {} as {
      type: "request to worker for calculation";
      command: ChromeEventType;
      context: IContext;
    },
  },
  context: {
    data: {},
    occurTabId: -1,
    occurWindowId: -1,
    prevOccurTabId: -1,
    prevOccurWindowId: -1,
    // workerRef: spawn(WorkerMachine)
  },
  predictableActionArguments: true,
  initial: "Loading",
  states: {
    Loading: {
      invoke: {
        src: "Call all chrome windows",
        onDone: [
          {
            target: "Loaded",
          },
        ],
        onError: [
          {
            target: "Failed",
          },
        ],
      },
    },
    Loaded: {
      initial: "Idle",
      states: {
        Idle: {
          on: {
            "Request calculating": {
              target: "Worker",
            },
          },
        },
        Worker: {
          entry: "request to worker for calculation",
          invoke: {
            src: WorkerMachine,
            id: "worker-machine",
            onDone: [
              {
                target: "Success",
              },
            ],
            onError: [
              {
                target: "Failed",
              },
            ],
          },
          on: {
            Test: {},
          },
        },
        Success: {
          entry: () => console.log("success!!!"),
          always: {
            target: "Idle",
          },
        },
        Failed: {
          entry: () => console.log('failed :('),
          always: {
            target: "Idle",
          },
        },
      },
      on: {
        Exit: {
          target: "Terminate",
        },
      },
    },
    Terminate: {
      type: "final",
    },
    Failed: {
      on: {
        Retry: {
          target: "Loading",
        },
      },
    },
  },
  id: "Current window machine",
},
    {
      services: {
        "Call all chrome windows":
          (context, event) => (callback, onReceive) => {
            setTimeout(
              () =>
                callback(
                  "done.invoke.Current window machine.Loading:invocation[0]"
                ),
              1000
            );
          },
      },
      actions: {
        "request to worker for calculation": send(
            {
              type: "ChromeEventType",
              command: ChromeEventType.WINDOW_CREATED
            },{ to: "worker-machine" }),
        },
      },
  );

const a = interpret(CurrentWindowMachine);

let state = a.initialState;

a.onTransition((s) => {
  console.log(s);
  state = s;
}).start();

const btn = document.createElement("button");
document.body.appendChild(btn);
btn.textContent = "to worker";
btn.addEventListener("click", () => {
  if (state.matches("Loaded.Idle")) {
    a.send({
      type: "Request calculating",
      command: ChromeEventType.WINDOW_CREATED,
    });
  } else if (state.matches("Loaded.Worker")) {
    a.send(state.event);
  }
});

// "invoke": {
//   "src": WorkerMachine,
//   "id": "worker-machine",
//   "onDone": [
//     {
//       "target": "Success"
//     }
//   ],
//   "onError": [
//     {
//       "target": "Failed"
//     }
//   ]
// }
