import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { usaaAnimations } from '@usaa/animations';
import { UsaaAlertAppearance,UsaaAlertType } from '@usaa/components/alert/alert.types';
import { UsaaAlertService } from '@usaa/components/alert/alert.service';
import { UsaaUtilsService } from '@usaa/services/utils/utils.service';

@Component({
    selector       : 'usaa-alert',
    templateUrl    : './alert.component.html',
    styleUrls      : ['./alert.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : usaaAnimations,
    exportAs       : 'usaaAlert'
})
export class UsaaAlertComponent implements OnChanges, OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_dismissible: BooleanInput;
    static ngAcceptInputType_dismissed: BooleanInput;
    static ngAcceptInputType_showIcon: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() appearance:UsaaAlertAppearance = 'soft';
    @Input() dismissed: boolean = false;
    @Input() dismissible: boolean = false;
    @Input() name: string = this.usaaUtilsService.randomId();
    @Input() showIcon: boolean = true;
    @Input() type:UsaaAlertType = 'primary';
    @Output() readonly dismissedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private usaaAlertService:UsaaAlertService,
        private usaaUtilsService:UsaaUtilsService
    )
    {
    }

    @HostBinding('class') get classList(): any
    {
        return {
            'usaa-alert-appearance-border' : this.appearance === 'border',
            'usaa-alert-appearance-fill'   : this.appearance === 'fill',
            'usaa-alert-appearance-outline': this.appearance === 'outline',
            'usaa-alert-appearance-soft'   : this.appearance === 'soft',
            'usaa-alert-dismissed'         : this.dismissed,
            'usaa-alert-dismissible'       : this.dismissible,
            'usaa-alert-show-icon'         : this.showIcon,
            'usaa-alert-type-primary'      : this.type === 'primary',
            'usaa-alert-type-accent'       : this.type === 'accent',
            'usaa-alert-type-warn'         : this.type === 'warn',
            'usaa-alert-type-basic'        : this.type === 'basic',
            'usaa-alert-type-info'         : this.type === 'info',
            'usaa-alert-type-success'      : this.type === 'success',
            'usaa-alert-type-warning'      : this.type === 'warning',
            'usaa-alert-type-error'        : this.type === 'error'
        };
    }

    ngOnChanges(changes: SimpleChanges): void
    {
        if ( 'dismissed' in changes )
        {
            this.dismissed = coerceBooleanProperty(changes.dismissed.currentValue);

            this.toggleDismiss(this.dismissed);
        }

        if ( 'dismissible' in changes )
        {
            this.dismissible = coerceBooleanProperty(changes.dismissible.currentValue);
        }

        if ( 'showIcon' in changes )
        {
            this.showIcon = coerceBooleanProperty(changes.showIcon.currentValue);
        }
    }

    ngOnInit(): void
    {
        this.usaaAlertService.onDismiss
            .pipe(
                filter(name => this.name === name),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {

                this.dismiss();
            });

        // Subscribe to the show calls
        this.usaaAlertService.onShow
            .pipe(
                filter(name => this.name === name),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {

                // Show the alert
                this.show();
            });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    dismiss(): void
    {
        if ( this.dismissed )
        {
            return;
        }

        this.toggleDismiss(true);
    }

    show(): void
    {
        if ( !this.dismissed )
        {
            return;
        }

        this.toggleDismiss(false);
    }

    private toggleDismiss(dismissed: boolean): void
    {
        if ( !this.dismissible )
        {
            return;
        }

        this.dismissed = dismissed;

        this.dismissedChanged.next(this.dismissed);

        this.changeDetectorRef.markForCheck();
    }
}
