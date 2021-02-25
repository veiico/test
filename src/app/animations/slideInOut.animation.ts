import { trigger, transition, style, animate, state } from "@angular/animations";



export const slideInOutState = trigger('slideInOutState', [
    state('true', style({ transform: 'translateX(100%)', opacity: 0 })),
    state('false', style({'opacity': 1 })),
    transition('0 => 1', animate('.3s ease-out')),
    transition('1 => 0', animate('.3s ease-out'))
])

export const slideInOutDOM = trigger(
    'slideInOutDOM',
    [
        transition(
            ':enter', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('.3s ease-out', style({ transform: 'translateX(0)', 'opacity': 1 }))
            ]
        ),
        transition(
            ':leave', [
                style({ transform: 'translateX(0)', 'opacity': 1 }),
                animate('.3s ease-out', style({ transform: 'translateX(100%)', 'opacity': 0 }))
            ]
        )]
)






