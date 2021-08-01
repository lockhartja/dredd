import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsaaHighlightComponent } from '@usaa/components/highlight/highlight.component';

@NgModule({
    declarations: [
       UsaaHighlightComponent
    ],
    imports     : [
        CommonModule
    ],
    exports     : [
       UsaaHighlightComponent
    ]
})
export class UsaaHighlightModule
{
}
