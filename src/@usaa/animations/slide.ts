import { animate, state, style, transition, trigger } from '@angular/animations';
import { UsaaAnimationCurves, UsaaAnimationDurations } from './defaults';

export const slideInTop = trigger('slideInTop',
    [
        state('void',
            style({
                transform: 'translate3d(0, -100%, 0)'
            })
        ),

        state('*',
            style({
                transform: 'translate3d(0, 0, 0)'
            })
        ),

        // Prevent the transition if the state is false
        transition('void => false', []),
   
        transition('void => *', animate('{{timings}}'),
            {
                params: {
                    timings: `${UsaaAnimationDurations.entering} ${UsaaAnimationCurves.deceleration}`
                }
            }
        )
    ]
);

export const slideInBottom = trigger('slideInBottom',
    [
        state('void',
            style({
                transform: 'translate3d(0, 100%, 0)'
            })
        ),

        state('*',
            style({
                transform: 'translate3d(0, 0, 0)'
            })
        ),

        // Prevent the transition if the state is false
        transition('void => false', []),
        
        transition('void => *', animate('{{timings}}'),
            {
                params: {
                    timings: `${UsaaAnimationDurations.entering} ${UsaaAnimationCurves.deceleration}`
                }
            }
        )
    ]
);

export const slideInLeft = trigger('slideInLeft',
    [
        state('void',
            style({
                transform: 'translate3d(-100%, 0, 0)'
            })
        ),

        state('*',
            style({
                transform: 'translate3d(0, 0, 0)'
            })
        ),

        // Prevent the transition if the state is false
        transition('void => false', []),

        transition('void => *', animate('{{timings}}'),
            {
                params: {
                    timings: `${UsaaAnimationDurations.entering} ${UsaaAnimationCurves.deceleration}`
                }
            }
        )
    ]
);

export const slideInRight = trigger('slideInRight',
    [
        state('void',
            style({
                transform: 'translate3d(100%, 0, 0)'
            })
        ),

        state('*',
            style({
                transform: 'translate3d(0, 0, 0)'
            })
        ),

        // Prevent the transition if the state is false
        transition('void => false', []),

        transition('void => *', animate('{{timings}}'),
            {
                params: {
                    timings: `${UsaaAnimationDurations.entering} ${UsaaAnimationCurves.deceleration}`
                }
            }
        )
    ]
);

export const slideOutTop = trigger('slideOutTop',
    [
        state('*',
            style({
                transform: 'translate3d(0, 0, 0)'
            })
        ),

        state('void',
            style({
                transform: 'translate3d(0, -100%, 0)'
            })
        ),

        // Prevent the transition if the state is false
        transition('false => void', []),
        
        transition('* => void', animate('{{timings}}'),
            {
                params: {
                    timings: `${UsaaAnimationDurations.exiting} ${UsaaAnimationCurves.acceleration}`
                }
            }
        )
    ]
);

export const slideOutBottom = trigger('slideOutBottom',
    [
        state('*',
            style({
                transform: 'translate3d(0, 0, 0)'
            })
        ),

        state('void',
            style({
                transform: 'translate3d(0, 100%, 0)'
            })
        ),

        // Prevent the transition if the state is false
        transition('false => void', []),

        transition('* => void', animate('{{timings}}'),
            {
                params: {
                    timings: `${UsaaAnimationDurations.exiting} ${UsaaAnimationCurves.acceleration}`
                }
            }
        )
    ]
);

export const slideOutLeft = trigger('slideOutLeft',
    [
        state('*',
            style({
                transform: 'translate3d(0, 0, 0)'
            })
        ),

        state('void',
            style({
                transform: 'translate3d(-100%, 0, 0)'
            })
        ),

        // Prevent the transition if the state is false
        transition('false => void', []),

        transition('* => void', animate('{{timings}}'),
            {
                params: {
                    timings: `${UsaaAnimationDurations.exiting} ${UsaaAnimationCurves.acceleration}`
                }
            }
        )
    ]
);

export const slideOutRight = trigger('slideOutRight',
    [
        state('*',
            style({
                transform: 'translate3d(0, 0, 0)'
            })
        ),

        state('void',
            style({
                transform: 'translate3d(100%, 0, 0)'
            })
        ),

        // Prevent the transition if the state is false
        transition('false => void', []),

        transition('* => void', animate('{{timings}}'),
            {
                params: {
                    timings: `${UsaaAnimationDurations.exiting} ${UsaaAnimationCurves.acceleration}`
                }
            }
        )
    ]
);

