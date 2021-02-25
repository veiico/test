import { trigger, transition, style, animate, state } from "@angular/animations";

export const slideUpDownDOM = trigger(
    'slideUpDownDOM',
    [
        transition(
            ':enter', [
                style({ transform: 'translateY(100%)', opacity: 0 }),
                animate('.3s ease-out', style({ transform: 'translateY(0)', 'opacity': 1 }))
            ]
        ),
        transition(
            ':leave', [
                style({ transform: 'translateY(0)', 'opacity': 1 }),
                animate('.3s ease-out', style({ transform: 'translateY(100%)', 'opacity': 0 }))
            ]
        )]
);






