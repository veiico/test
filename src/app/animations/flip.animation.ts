import { trigger, transition, style, animate, state } from "@angular/animations";


export const flipState = trigger('flipState', [
  state('true', style({
    transform: 'rotateY(179.9deg)'
  })),
  state('false', style({
    transform: 'rotateY(0)'
  })),
  transition('0 => 0', animate('500ms ease-out')),
  transition('1 => 0', animate('500ms ease-in'))
])
