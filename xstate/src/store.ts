import { createMachine } from "xstate";

export const State =
  /** @xstate-layout N4IgpgJg5mDOIC5QBED2UB0BBWAbMYADgMQDKAtmLrrAAQBmqqEiohqsAlgC6eoB2rEAA9EARgBsAFgwAmABwT5AVnlTZ6gAyaAnFIA0IAJ6JZkjMoDMqqVIDsdzdYlipAXzeG0mHPiLEAGVQAVwhaflROWDAhdi5eASFRBEtZSzk7ZUkxZWUdTMsJQxMEOzEMHUrKuylLMV1lWTsPL3RsAHcAQwBrMAxSP0IjQJCwiKiYpBA4nj5BKeSpeR0MSwdNKR01iTt5WSLjREt5dMsdVX2dWStNZs8Qbw6esGIAMU7qOk68AkJYjlmiQWiCkygqmUUEjSYnO+RUxSOEhWqjECnqYmOEiUHnuEQgcCEj18v3+8TmSRBsgRCCxLQebSwXV6-UGJTYAIS81AizMGChOTUVwk2k0Ymplk08jkymFMrSdn27nuRKZfVIAGNOgAnSCkwFckSICTWDBSJEbNaWWobZTUpZgsTyTQ7STG+SZWR0lXPPWcikpfJ8sw2IUisWHBBpCTS4WKvQaQoSL3oX3k4EIR3UgC0YKqlXdwscNR0YhxbiAA */
  createMachine({
    id: "Dog",
    initial: "Asleep",
    states: {
      Asleep: {
        on: {
          "Smells food": {
            target: "#Dog.Awake.Sleepy",
          },
          "Loud noise": {
            target: "#Dog.Awake.Scared",
          },
        },
      },
      Awake: {
        initial: "Sleepy",
        states: {
          Sleepy: {
            on: {
              "Loud noise": {
                target: "Scared",
              },
            },
          },
          Scared: {},
        },
        on: {
          "Falls asleep": {
            target: "Asleep",
          },
        },
      },
    },
  });

export const FinalState =
  /** @xstate-layout N4IgpgJg5mDOIC5QHUCGAbA1gOjQSwBc8A7KAYgBkxUA3MAAgAsB7AWzEVAAdnZC9mxTiAAeiAEwAObONkBOAKwA2BQGZJ4gIwbJAFgA0IAJ6IF2AAwB2TXMtLVqhZLmbdrgL7vDaLNgDyxPSo9ADuGJhkAOJgBPQARqgAxphMbBxIIDx8RILCYgiS5tiqcrKSCrqWkkrOcoYmCJrq2Moluk6l9rrm4p5eIMTMEHDCPjj4RKTCWfy5GfkAtBotupKWLkpNCraaSvWIC0py2JsO5uW7PZsKnt7h-oHBYVjTvLNC84ia2thy53Y9TSWSzncQKfYIJSWbCWBSWcRHHpWIGyW4gMa4cL0MDEYYQV7ZAQfUCLdbYGxyXS6BHKZRyKEQ8TmVQnOSqLRQ1R2NxstFjAnvPIHTTmJQrNYbLY7PbGYVuE5NVTmUWSVTfdZ9dxAA */
  createMachine({
    initial: "Waiting",
    states: {
      Waiting: {
        on: {
          "Leave home": {
            target: "On a walk",
          },
        },
      },
      "On a walk": {
        on: {
          "Get back home": {
            target: "Walk ended",
          },
        },
      },
      "Walk ended": {
        type: "final",
      },
    },
    id: "Walk",
  });

export const ParallelState =
  /** @xstate-layout N4IgpgJg5mDOIC5QGECGAbdACAtqgxgBYCWAdmAHQBqxEYA9hQMqH0DuZUWAbrQwMQAJPjz71EoAA71YxAC7F6pCSAAeiAGwAWLRQDMGvUYBMxgKwB2C8YAMZgDQgAnogCMATg0Ut5ja4Ac-hoWWho2WnoAvpGOaJi4BCTk1GIUwhCconT0-CzsWQwq0rIKSirqCDoWFBZ6Fq5aAXruNtpBji4Ixlr+FGb+xgburmYBYeHRsRjYeERklACyxPgATvSSrMkLAK5ykPwAqqQ4u2BFMvKKykhqiAC0rjZ63sYapjbG-k96OsYdiKZ3BRXEZgp8GsYLB8NJMQHEZol5hQlqt1ptKEcTnsIPwdntziUruU3Boga1-K5Ke5-BZAqD-ggPMYKKYLGYzD8oWYNF8tLD4Qk5ltlmsNkoMcdTjiAKLcMCkORYUioHBnG7FS5lG4VVzVGyubSPXW1eqeDQMsyQigfCzuMzuO2s1zRGIgUj0OjwG4C2ZJSg0bLMVgcUhcXjZAma66gCoRXSWPStUn+HwaUYMhrVVyvUaDYJpzzO10+xHJAMMNK0TLhwrqi6laO3BB+XQgpqJ7nDIwM4wO616AZ+bmWoxFqbxX1I8viOuErUxxCNGx9WpJ6mp9PORBs4E57p6Xv+UYc-nTQV+5EitHi5FSyMN4kIO5plk8t7uPT20JmHQM4Y1ZoDB0fotChNNTwnUtFivMVkkxO9ZyjR9n2ZGxAncLQOW6H9hnNLcECMMxvA0bQbGGDxMKMCCESFaDUVgtUpHrIltXubNqlTd5Pm+X4MyBWoP1GPRs2EuwYWLM9J2Scg2CwWA5FQPYsFce8WIXLo-BZHxhm5EjDHcC1QmtOw2U+fdhIsajz3mVT5ybB5RheN5bG4oxf3wu5LVfJN2xTR0zBdSIgA */
  createMachine(
    {
  predictableActionArguments: true,
  type: "parallel",
  states: {
    Video: {
      initial: "Showing video",
      states: {
        "Showing video": {
          on: {
            "Hide video": {
              target: "Hiding video",
            },
          },
        },
        "Hiding video": {
          on: {
            "Show video": {
              target: "Showing video",
            },
          },
        },
      },
    },
    Microphone: {
      initial: "Muted",
      states: {
        Muted: {
          entry: "Mute microphone",
          on: {
            Unmute: {
              target: "Unmuted",
            },
          },
        },
        Unmuted: {
          entry: "incrementToggle",
          on: {
            Mute: {
              target: "Muted",
            },
            "Event name": {
              target: "#Call machine.new state 1",
            },
          },
        },
      },
    },
    "new state 1": {},
  },
  id: "Call machine",
},
    {
      actions: {
        "Mute microphone": () => {},
        incrementToggle: () => {
          console.log("hello world");
        },
      },
      guards: {

      }
    }
  );

export const SelfTransition =
  /** @xstate-layout N4IgpgJg5mDOIC5QBED2UB0BBWAbMYADgMQDKAtmLrrAAQBmqqEiohqsAlgC6eoB2rEAA9EAWgDMAdgAsGaQEYArAA4VANilSVMgAxSlAGhABPccokYVSgJwAmOzdlTNtpQF93xtJhz4ixAAyqACuELT8qJywYELsXLwCQqIIYnoKGFISdvpSuup2OnYyRqaI2Rj50iW6Cjb2uhLqnt7o2ADuAIYA1mAYpP6EJkGh4ZHRsUgg8Tx8glMpdpWy1tbFajJSNurGZqk2lbr22woyKlkqEjISLSA+HT19AEJgUFCc-FDEAOKcAG5gWjcABOYE63DiHFmSQW4iUSgwNhkNiOqnUNgUdhcOzKCC08hkChUdgUpP0Ehs0lu9ywXV6xAAYp1qHROngCIRIQk5slxNUMAoXFj7IKZOkZLtxIUpBg7BIlOoLPUpI5BZ4vCBIhA4EIaeyiFzofNQCkxGjEdYKYL1AV1MTJakcioBQo7eo0TZLWpqW1aY9+oM9mwoYljSJzKpKlclIV4cUFZcHWJlAdrCKba71PkPBqaXS+qQAMadUEsKYzUO81LKZ3WM56MUlJqUh2YzKXJQlG0GFGkhQ+3z5jAvN4fKCGyuw1JKDJbQqFO0x1ROVuKjDqTZYrZI07ZOwDh69Cc8qfJ4lWTs6XSNpTNiRJuUZNN1OwFPTy-u59DHmEm8SK3QLVvDFsVfe1cUkWxZXlWxTn0ZRtHVdwgA */
  createMachine({
    id: "Dog",
    initial: "Asleep",
    states: {
      Asleep: {
        on: {
          "Smells food": {
            target: "#Dog.Awake.Sleepy",
          },
          "Loud noise": {
            target: "#Dog.Awake.Scared",
          },
        },
      },
      Awake: {
        initial: "Begging",
        states: {
          Sleepy: {
            on: {
              "Loud noise": {
                target: "Scared",
              },
            },
          },
          Scared: {},
          Begging: {
            on: {
              "Give treat": {},
            },
          },
        },
        on: {
          "Falls asleep": {
            target: "Asleep",
          },
        },
      },
    },
  }).withConfig({
    // actions ...
  });

export const ActionExample =
  /** @xstate-layout N4IgpgJg5mDOIC5QGECGAbdACAtqgxgBYCWAdmAHQBqxEYA9hQMqH0DuZUWAbrQwMQAJPjz71EoAA71YxAC7F6pCSAAeiAGwaArBQDMGgAwB2YwBYze7QE4ATAEZtAGhABPRLbPH914w4v2ABwGQWYAvmEuaJi4BCTk1GIUwhCconT0-Czs6Qwq0rIKSirqCF7etnrW2gZ6hoGGhmaGGi7uCFV6FC3aGg32XhrGGnoRURjYeERklACyxPgATvSSrAmzAK5ykPyb2-ky8orKSGqIALTW3dYa1nr2esZBQ+ZtiHpWFM32tobagTczPZDNZwpEQNFJnEZhR5ksVmtKABVUg4LY7FFo-anApHYqnUr2EbXCwjaz2PxPMxvDqfb6-f6A4GgiLg0j0OjwU6Q2LTBI0DLMVgcUhcXgZA6FY4lRBmDRmbrGbRywLKiny3o0zwaCjVAHaWz-Yzk5ljCETXnxSgChjJWhpcV5HGHIonUCleVdEZmSpygZA2yBGlVQIUQLGEyGCmqsyBOVmnlTK2JCXOqX492y5qK5V9NXDMyatyICkKvV3PoGayGOpg8YxJMwuHLVZKOboiCSvFus4Ic6ObpGZpNGqeYz3exagwUbT-bTRoGR5UJi2N9YLFuIiiYjtd10yvs-MNGGtK6wNWxK1rFsq2WwUTxVH7nvWmFcN6Hr+Gt8h76UEi4qkHJpGkLPQx3uGkiQVWdVUcO5emCYx3yhPkwD-DNe3OYkWhAkdwK8SCbzsGc50aUIhl6exWTCIA */
  createMachine({
    tsTypes: {} as import("./store.typegen").Typegen0,
    type: "parallel",
    states: {
      Video: {
        initial: "Showing video",
        states: {
          "Showing video": {
            on: {
              "Hide video": {
                target: "Hiding video",
              },
            },
          },
          "Hiding video": {
            on: {
              "Show video": {
                target: "Showing video",
              },
            },
          },
        },
      },
      Microphone: {
        initial: "Muted",
        states: {
          Muted: {
            on: {
              Mute: {
                actions: () => "Mute",
                target: "Unmuted",
              },
            },
          },
          Unmuted: {
            on: {
              Unmute: {
                actions: () => "Unmute",
                target: "Muted",
              },
            },
          },
        },
      },
    },
    id: "Call machine",
  });
