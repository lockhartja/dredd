import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import {usaaAnimations } from '@usaa/animations';
import {UsaaNavigationItem } from '@usaa/components/navigation/navigation.types';
import {UsaaNavigationService } from '@usaa/components/navigation/navigation.service';
import {UsaaUtilsService } from '@usaa/services/utils/utils.service';

@Component({
    selector       : 'usaa-horizontal-navigation',
    templateUrl    : './horizontal.component.html',
    styleUrls      : ['./horizontal.component.scss'],
    animations     : usaaAnimations,
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'usaaHorizontalNavigation'
})
export class UsaaHorizontalNavigationComponent implements OnChanges, OnInit, OnDestroy
{
    @Input() name: string = this.usaaUtilsService.randomId();
    @Input() navigation!: UsaaNavigationItem[];

    onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private usaaNavigationService:UsaaNavigationService,
        private usaaUtilsService:UsaaUtilsService
    )
    {
    }

    ngOnChanges(changes: SimpleChanges): void
    {
        if ( 'navigation' in changes )
        {
            // Mark for check
            this.changeDetectorRef.markForCheck();
        }
    }

    ngOnInit(): void
    {
        // Make sure the name input is not an empty string
        if ( this.name === '' )
        {
            this.name = this.usaaUtilsService.randomId();
        }

        // Register the navigation component
        this.usaaNavigationService.registerComponent(this.name, this);
    }

    ngOnDestroy(): void
    {
        // Deregister the navigation component from the registry
        this.usaaNavigationService.deregisterComponent(this.name);

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    refresh(): void
    {
        // Mark for check
        this.changeDetectorRef.markForCheck();

        // Execute the observable
        this.onRefreshed.next(true);
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
