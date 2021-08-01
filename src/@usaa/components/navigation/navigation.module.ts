import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsaaScrollbarModule } from '@usaa/directives/scrollbar';
import { UsaaHorizontalNavigationBasicItemComponent } from '@usaa/components/navigation/horizontal/components/basic/basic.component';
import { UsaaHorizontalNavigationBranchItemComponent } from '@usaa/components/navigation/horizontal/components/branch/branch.component';
import { UsaaHorizontalNavigationDividerItemComponent } from '@usaa/components/navigation/horizontal/components/divider/divider.component';
import { UsaaHorizontalNavigationSpacerItemComponent } from '@usaa/components/navigation/horizontal/components/spacer/spacer.component';
import { UsaaHorizontalNavigationComponent } from '@usaa/components/navigation/horizontal/horizontal.component';
import { UsaaVerticalNavigationAsideItemComponent } from '@usaa/components/navigation/vertical/components/aside/aside.component';
import { UsaaVerticalNavigationBasicItemComponent } from '@usaa/components/navigation/vertical/components/basic/basic.component';
import { UsaaVerticalNavigationCollapsableItemComponent } from '@usaa/components/navigation/vertical/components/collapsable/collapsable.component';
import { UsaaVerticalNavigationDividerItemComponent } from '@usaa/components/navigation/vertical/components/divider/divider.component';
import { UsaaVerticalNavigationGroupItemComponent } from '@usaa/components/navigation/vertical/components/group/group.component';
import { UsaaVerticalNavigationSpacerItemComponent } from '@usaa/components/navigation/vertical/components/spacer/spacer.component';
import { UsaaVerticalNavigationComponent } from '@usaa/components/navigation/vertical/vertical.component';

@NgModule({
    declarations: [
        UsaaHorizontalNavigationBasicItemComponent,
        UsaaHorizontalNavigationBranchItemComponent,
        UsaaHorizontalNavigationDividerItemComponent,
        UsaaHorizontalNavigationSpacerItemComponent,
        UsaaHorizontalNavigationComponent,
        UsaaVerticalNavigationAsideItemComponent,
        UsaaVerticalNavigationBasicItemComponent,
        UsaaVerticalNavigationCollapsableItemComponent,
        UsaaVerticalNavigationDividerItemComponent,
        UsaaVerticalNavigationGroupItemComponent,
        UsaaVerticalNavigationSpacerItemComponent,
        UsaaVerticalNavigationComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        UsaaScrollbarModule,
    ],
    exports: [UsaaHorizontalNavigationComponent, UsaaVerticalNavigationComponent],
})
export class UsaaNavigationModule {}
