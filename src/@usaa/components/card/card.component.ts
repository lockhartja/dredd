import { Component, HostBinding, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { usaaAnimations } from '@usaa/animations';
import { UsaaCardFace } from '@usaa/components/card/card.types';

@Component({
    selector     : 'usaa-card',
    templateUrl  : './card.component.html',
    styleUrls    : ['./card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : usaaAnimations,
    exportAs     : 'usaaCard'
})
export class UsaaCardComponent implements OnChanges
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_expanded: BooleanInput;
    static ngAcceptInputType_flippable: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() expanded: boolean = false;
    @Input() face:UsaaCardFace = 'front';
    @Input() flippable: boolean = false;

    constructor()
    {
    }

    @HostBinding('class') get classList(): any
    {
        return {
            'usaa-card-expanded'  : this.expanded,
            'usaa-card-face-back' : this.flippable && this.face === 'back',
            'usaa-card-face-front': this.flippable && this.face === 'front',
            'usaa-card-flippable' : this.flippable
        };
    }

    ngOnChanges(changes: SimpleChanges): void
    {
        if ( 'expanded' in changes )
        {
            this.expanded = coerceBooleanProperty(changes.expanded.currentValue);
        }

        if ( 'flippable' in changes )
        {
            this.flippable = coerceBooleanProperty(changes.flippable.currentValue);
        }
    }
}
