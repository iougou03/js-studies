import { interpret } from "xstate";
import { parentMachine, remoteMachine } from "./parent_child";


const parentService = interpret(parentMachine)
  .onTransition((state) => console.log(state))
  .start();

parentService.send({ type: 'LOCAL.WAKE' });



const btn = document.createElement('button');
btn.textContent = 'click it to check'
btn.addEventListener('click', () => {
  parentService.send('Send next event');
})

// const btn2 = document.createElement('button');
// btn2.textContent = 'is?'
// btn2.addEventListener('click', () => {
//   parentService.send('LOCAL.WAKE');
// })


addToBody(btn);

function addToBody(...elems) {
  elems.forEach(e => document.body.appendChild(e));
}