import { animate, state, style, transition, trigger } from '@angular/animations';
import { UsaaAnimationCurves, UsaaAnimationDurations } from './defaults';

export const fadeIn = trigger('fadeIn',
    [
        state('void',
            style({
                opacity: 0
            })
        ),

        state('*',
            style({
                opacity: 1
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


export const fadeInTop = trigger('fadeInTop',
    [
        state('void',
            style({
                opacity  : 0,
                transform: 'translate3d(0, -100%, 0)'
            })
        ),

        state('*',
            style({
                opacity  : 1,
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

export const fadeInBottom = trigger('fadeInBottom',
    [
        state('void',
            style({
                opacity  : 0,
                transform: 'translate3d(0, 100%, 0)'
            })
        ),

        state('*',
            style({
                opacity  : 1,
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

export const fadeInLeft = trigger('fadeInLeft',
    [
        state('void',
            style({
                opacity  : 0,
                transform: 'translate3d(-100%, 0, 0)'
            })
        ),

        state('*',
            style({
                opacity  : 1,
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

export const fadeInRight = trigger('fadeInRight',
    [
        state('void',
            style({
                opacity  : 0,
                transform: 'translate3d(100%, 0, 0)'
            })
        ),

        state('*',
            style({
                opacity  : 1,
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

export const fadeOut = trigger('fadeOut',
    [
        state('*',
            style({
                opacity: 1
            })
        ),

        state('void',
            style({
                opacity: 0
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


export const fadeOutTop = trigger('fadeOutTop',
    [
        state('*',
            style({
                opacity  : 1,
                transform: 'translate3d(0, 0, 0)'
            })
        ),

        state('void',
            style({
                opacity  : 0,
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


export const fadeOutBottom = trigger('fadeOutBottom',
    [
        state('*',
            style({
                opacity  : 1,
                transform: 'translate3d(0, 0, 0)'
            })
        ),

        state('void',
            style({
                opacity  : 0,
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


export const fadeOutLeft = trigger('fadeOutLeft',
    [
        state('*',
            style({
                opacity  : 1,
                transform: 'translate3d(0, 0, 0)'
            })
        ),

        state('void',
            style({
                opacity  : 0,
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

export const fadeOutRight = trigger('fadeOutRight',
    [
        state('*',
            style({
                opacity  : 1,
                transform: 'translate3d(0, 0, 0)'
            })
        ),

        state('void',
            style({
                opacity  : 0,
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

