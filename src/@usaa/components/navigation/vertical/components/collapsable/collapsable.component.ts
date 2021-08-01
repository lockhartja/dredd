import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { usaaAnimations } from '@usaa/animations';
import { UsaaVerticalNavigationComponent } from '@usaa/components/navigation/vertical/vertical.component';
import { UsaaNavigationService } from '@usaa/components/navigation/navigation.service';
import { UsaaNavigationItem } from '@usaa/components/navigation/navigation.types';

@Component({
    selector: 'usaa-vertical-navigation-collapsable-item',
    templateUrl: './collapsable.component.html',
    styles: [],
    animations: usaaAnimations,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsaaVerticalNavigationCollapsableItemComponent implements OnInit, OnDestroy {
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_autoCollapse: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() autoCollapse = false;
    @Input() item!: UsaaNavigationItem;
    @Input() name = '';

    isCollapsed: boolean = true;
    isExpanded: boolean = false;
    private usaaVerticalNavigationComponent!: UsaaVerticalNavigationComponent;
    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private usaaNavigationService: UsaaNavigationService
    ) {}

    @HostBinding('class') get classList(): any {
        return {
            'usaa-vertical-navigation-item-collapsed': this.isCollapsed,
            'usaa-vertical-navigation-item-expanded': this.isExpanded,
        };
    }

    ngOnInit(): void {
        this.usaaVerticalNavigationComponent = this.usaaNavigationService.getComponent(this.name);

        // If the item has a children that has a matching url with the current url, expand...
        if (this.hasActiveChild(this.item, this.router.url)) {
            this.expand();
        }
        // Otherwise...
        else {
            // If the autoCollapse is on, collapse...
            if (this.autoCollapse) {
                this.collapse();
            }
        }

        this.usaaVerticalNavigationComponent.onCollapsableItemCollapsed
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((collapsedItem: any) => {
                // Check if the collapsed item is null
                if (collapsedItem === null) {
                    return;
                }

                // Collapse if this is a children of the collapsed item
                if (this._isChildrenOf(collapsedItem, this.item)) {
                    this.collapse();
                }
            });

        // Listen for the onCollapsableItemExpanded from the service if the autoCollapse is on
        if (this.autoCollapse) {
            this.usaaVerticalNavigationComponent.onCollapsableItemExpanded
                .pipe(takeUntil(this.unsubscribeAll))
                .subscribe((expandedItem: any) => {
                    // Check if the expanded item is null
                    if (expandedItem === null) {
                        return;
                    }

                    // Check if this is a parent of the expanded item
                    if (this._isChildrenOf(this.item, expandedItem)) {
                        return;
                    }

                    // Check if this has a children with a matching url with the current active url
                    if (this.hasActiveChild(this.item, this.router.url)) {
                        return;
                    }

                    // Check if this is the expanded item
                    if (this.item === expandedItem) {
                        return;
                    }

                    // If none of the above conditions are matched, collapse this item
                    this.collapse();
                });
        }

        // Attach a listener to the NavigationEnd event
        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                takeUntil(this.unsubscribeAll)
            )
            .subscribe((event: NavigationEnd) => {
                // If the item has a children that has a matching url with the current url, expand...
                if (this.hasActiveChild(this.item, event.urlAfterRedirects)) {
                    this.expand();
                }
                // Otherwise...
                else {
                    // If the autoCollapse is on, collapse...
                    if (this.autoCollapse) {
                        this.collapse();
                    }
                }
            });

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

    collapse(): void {
        // Return if the item is disabled
        if (this.item.disabled) {
            return;
        }

        // Return if the item is already collapsed
        if (this.isCollapsed) {
            return;
        }

        // Collapse it
        this.isCollapsed = true;
        this.isExpanded = !this.isCollapsed;

        // Mark for check
        this.changeDetectorRef.markForCheck();

        // Execute the observable
        this.usaaVerticalNavigationComponent.onCollapsableItemCollapsed.next(this.item);
    }

    expand(): void {
        // Return if the item is disabled
        if (this.item.disabled) {
            return;
        }

        // Return if the item is already expanded
        if (!this.isCollapsed) {
            return;
        }

        // Expand it
        this.isCollapsed = false;
        this.isExpanded = !this.isCollapsed;

        // Mark for check
        this.changeDetectorRef.markForCheck();

        // Execute the observable
        this.usaaVerticalNavigationComponent.onCollapsableItemExpanded.next(this.item);
    }

    toggleCollapsable(): void {
        // Toggle collapse/expand
        if (this.isCollapsed) {
            this.expand();
        } else {
            this.collapse();
        }
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    private hasActiveChild(item: UsaaNavigationItem, currentUrl: string): boolean {
        const children = item.children;

        if (!children) {
            return false;
        }

        for (const child of children) {
            if (child.children) {
                if (this.hasActiveChild(child, currentUrl)) {
                    return true;
                }
            }

            // Check if the child has a link and is active
            if (child.link && this.router.isActive(child.link, child.exactMatch || false)) {
                return true;
            }
        }

        return false;
    }

    private _isChildrenOf(parent: UsaaNavigationItem, item: UsaaNavigationItem): boolean {
        const children = parent.children;

        if (!children) {
            return false;
        }

        if (children.indexOf(item) > -1) {
            return true;
        }

        for (const child of children) {
            if (child.children) {
                if (this._isChildrenOf(child, item)) {
                    return true;
                }
            }
        }

        return false;
    }
}
