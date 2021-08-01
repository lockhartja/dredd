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
import { UsaaHorizontalNavigationComponent } from '@usaa/components/navigation/horizontal/horizontal.component';
import { UsaaNavigationService } from '@usaa/components/navigation/navigation.service';
import { UsaaNavigationItem } from '@usaa/components/navigation/navigation.types';

@Component({
    selector: 'usaa-horizontal-navigation-spacer-item',
    templateUrl: './spacer.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsaaHorizontalNavigationSpacerItemComponent implements OnInit, OnDestroy {
    @Input() item!: UsaaNavigationItem;
    @Input() name = '';

    private usaaHorizontalNavigationComponent!: UsaaHorizontalNavigationComponent;
    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private usaaNavigationService: UsaaNavigationService
    ) {}

    ngOnInit(): void {
        this.usaaHorizontalNavigationComponent = this.usaaNavigationService.getComponent(this.name);

        this.usaaHorizontalNavigationComponent.onRefreshed
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(() => {
                // Mark for check
                this.changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
}
