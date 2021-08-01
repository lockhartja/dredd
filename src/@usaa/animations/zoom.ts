import { animate, state, style, transition, trigger } from '@angular/animations';
import { UsaaAnimationCurves, UsaaAnimationDurations } from './defaults';

export const zoomIn = trigger('zoomIn',
    [

        state('void',
            style({
                opacity  : 0,
                transform: 'scale(0.5)'
            })
        ),

        state('*',
            style({
                opacity  : 1,
                transform: 'scale(1)'
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

export const zoomOut = trigger('zoomOut',
    [

        state('*',
            style({
                opacity  : 1,
                transform: 'scale(1)'
            })
        ),

        state('void',
            style({
                opacity  : 0,
                transform: 'scale(0.5)'
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


