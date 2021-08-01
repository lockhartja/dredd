import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UsaaVerticalNavigationComponent } from '@usaa/components/navigation/vertical/vertical.component';
import { UsaaNavigationService } from '@usaa/components/navigation/navigation.service';
import { UsaaNavigationItem } from '@usaa/components/navigation/navigation.types';

@Component({
    selector: 'usaa-vertical-navigation-spacer-item',
    templateUrl: './spacer.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsaaVerticalNavigationSpacerItemComponent implements OnInit, OnDestroy {
    @Input() item!: UsaaNavigationItem;
    @Input() name = '';

    private usaaVerticalNavigationComponent!: UsaaVerticalNavigationComponent;
    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private usaaNavigationService: UsaaNavigationService
    ) {}

    ngOnInit(): void {
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
}
