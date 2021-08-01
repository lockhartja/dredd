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
import { UsaaVerticalNavigationComponent } from '@usaa/components/navigation/vertical/vertical.component';
import { UsaaNavigationService } from '@usaa/components/navigation/navigation.service';
import { UsaaNavigationItem } from '@usaa/components/navigation/navigation.types';
import { UsaaUtilsService } from '@usaa/services/utils/utils.service';

@Component({
    selector: 'usaa-vertical-navigation-basic-item',
    templateUrl: './basic.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsaaVerticalNavigationBasicItemComponent implements OnInit, OnDestroy {
    @Input() item!: UsaaNavigationItem;
    @Input() name = '';

    isActiveMatchOptions: any;
    private usaaVerticalNavigationComponent!: UsaaVerticalNavigationComponent;
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

    ngOnInit(): void {
        // Set the "isActiveMatchOptions" either from item's
        // "isActiveMatchOptions" or the equivalent form of
        // item's "exactMatch" option
        this.isActiveMatchOptions = this.item.exactMatch
            ? this.usaaUtilsService.exactMatchOptions
            : this.usaaUtilsService.subsetMatchOptions;

        // Get the parent navigation component
        this.usaaVerticalNavigationComponent = this.usaaNavigationService.getComponent(this.name);

        // Mark for check
        this.changeDetectorRef.markForCheck();

        // Subscribe to onRefreshed on the navigation component
        this.usaaVerticalNavigationComponent.onRefreshed
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(() => {
                // Mark for check
                this.changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
}
