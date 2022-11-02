import { assign, createMachine, interpret } from "xstate";

const machine = 
/** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiTC3TAawG0AGAXUVAAcB7WXABdcvfFxAAPRAEYALLIA0IAJ4yAzLIC+mpWix5CpQhMEACWIPSCadBiw7i+A4aPFSEcxSsQAOAEzaOiD4vBBw4no4BMRklGCO-EIiYkiSiLJ+SqoIPj4kagWFRUXauhhRhiTGZhZW8alOSa6p7n5qAJz5smoA7ACsWYjtrCQ+xeMFpSCRBsQJzsluiAC0AGyDCGuBmkA */
createMachine({
  context: {
    isClicked: false,
  },
  tsTypes: {} as import("./context-test.typegen").Typegen0,
  schema: {
    events: {} as {type: 'click'},
    context: {} as {
        isClicked: boolean
    }
  },
  initial: "idle",
  states: {
    idle: {
      on: {
        click: {
          target: "next state",
          actions: (context, _) => {
            context.isClicked = !context.isClicked
          }
        },
      },
    },
    "next state": {
      on: {
        click: {
          target: "idle",
          actions: (context, _) => {
            context.isClicked = !context.isClicked
          }
        },
      },
    },
  },
  id: "(machine)",
})

const service1 = interpret(machine).onTransition(s => console.log('[1]', s)).start()
const service2 = interpret(machine).onTransition(s => console.log('[2]', s)).start()

const button = document.createElement('button');
button.textContent = 'click';
button.addEventListener('click', () => {

    service1.send('click')
    
    console.log(service1.state.context)
    console.log(service1.state.value)
    console.log(service2.state.context)
    console.log(service2.state.value)
})
document.body.appendChild(button);


