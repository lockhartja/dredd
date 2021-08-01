import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UsaaHorizontalNavigationComponent } from '@usaa/components/navigation/horizontal/horizontal.component';
import { UsaaNavigationService } from '@usaa/components/navigation/navigation.service';
import { UsaaNavigationItem } from '@usaa/components/navigation/navigation.types';
import { UsaaUtilsService } from '@usaa/services/utils/utils.service';

@Component({
    selector: 'usaa-horizontal-navigation-basic-item',
    templateUrl: './basic.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsaaHorizontalNavigationBasicItemComponent implements OnInit, OnDestroy {
    @Input() item!: UsaaNavigationItem;
    @Input() name = '';

    isActiveMatchOptions: any;
    private usaaHorizontalNavigationComponent!: UsaaHorizontalNavigationComponent;
    private unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private usaaNavigationService: UsaaNavigationService,
        private usaaUtilsService: UsaaUtilsService
    ) {
        // Set the equivalent of {exact: false} as default for active match options.
        // We are not assigning the item.isActiveMatchOptions directly to the
        // [routerLinkActiveOptions] because if it's "undefined" initially, the router
        // will throw an error and stop working.
        this.isActiveMatchOptions = this.usaaUtilsService.subsetMatchOptions;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Set the "isActiveMatchOptions" either from item's
        // "isActiveMatchOptions" or the equivalent form of
        // item's "exactMatch" option
        this.isActiveMatchOptions = this.item.exactMatch
            ? this.usaaUtilsService.exactMatchOptions
            : this.usaaUtilsService.subsetMatchOptions;

        // Get the parent navigation component
        this.usaaHorizontalNavigationComponent = this.usaaNavigationService.getComponent(this.name);

        // Mark for check
        this.changeDetectorRef.markForCheck();

        // Subscribe to onRefreshed on the navigation component
        this.usaaHorizontalNavigationComponent.onRefreshed
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(() => {
                this.changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
}
