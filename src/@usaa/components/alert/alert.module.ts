import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsaaAlertComponent } from '@usaa/components/alert/alert.component';

@NgModule({
    declarations: [
        UsaaAlertComponent
    ],
    imports     : [
        CommonModule,
        MatButtonModule,
        MatIconModule
    ],
    exports     : [
        UsaaAlertComponent
    ]
})
export class UsaaAlertModule
{
}
