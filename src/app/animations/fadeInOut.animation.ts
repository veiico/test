import {
  trigger,
  transition,
  style,
  animate,
  state
} from "@angular/animations";

export const fadeInOutDOM = trigger("fadeInOutDOM", [
  transition(":enter", [
    style({ opacity: 0}),
    animate(".3s ease-in", style({ opacity: 1 }))
  ]),
  transition(":leave", [
    style({ opacity: 1}),
    animate(".16s ease-out", style({ opacity: 0 }))
  ])
]);
