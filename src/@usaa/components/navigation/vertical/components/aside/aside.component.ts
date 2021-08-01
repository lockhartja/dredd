import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { UsaaVerticalNavigationComponent } from '@usaa/components/navigation/vertical/vertical.component';
import { UsaaNavigationService } from '@usaa/components/navigation/navigation.service';
import { UsaaNavigationItem } from '@usaa/components/navigation/navigation.types';

@Component({
    selector: 'usaa-vertical-navigation-aside-item',
    templateUrl: './aside.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsaaVerticalNavigationAsideItemComponent implements OnChanges, OnInit, OnDestroy {
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_autoCollapse: BooleanInput;
    static ngAcceptInputType_skipChildren: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() activeItemId = '';
    @Input() autoCollapse = false;
    @Input() item!: UsaaNavigationItem;
    @Input() name = '';
    @Input() skipChildren = false;

    active: boolean = false;
    private usaaVerticalNavigationComponent!: UsaaVerticalNavigationComponent;
    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private usaaNavigationService: UsaaNavigationService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if ('activeItemId' in changes) {
            // Mark if active
            this.markIfActive(this.router.url);
        }
    }

    ngOnInit(): void {
        // Mark if active
        this.markIfActive(this.router.url);

        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                takeUntil(this.unsubscribeAll)
            )
            .subscribe((event: NavigationEnd) => {
                // Mark if active
                this.markIfActive(event.urlAfterRedirects);
            });

        // Get the parent navigation component
        this.usaaVerticalNavigationComponent = this.usaaNavigationService.getComponent(this.name);

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

            if (child.type !== 'basic') {
                continue;
            }

            if (child.link && this.router.isActive(child.link, child.exactMatch || false)) {
                return true;
            }
        }

        return false;
    }

    private markIfActive(currentUrl: string): void {
        // Check if the activeItemId is equals to this item id
        this.active = this.activeItemId === this.item.id;

        // If the aside has a children that is active,
        // always mark it as active
        if (this.hasActiveChild(this.item, currentUrl)) {
            this.active = true;
        }

        // Mark for check
        this.changeDetectorRef.markForCheck();
    }
}
