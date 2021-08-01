import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsaaCardComponent } from '@usaa/components/card/card.component';

@NgModule({
    declarations: [
       UsaaCardComponent
    ],
    imports     : [
        CommonModule
    ],
    exports     : [
       UsaaCardComponent
    ]
})
export class UsaaCardModule
{
}
