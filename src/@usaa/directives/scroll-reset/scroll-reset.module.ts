import { NgModule } from '@angular/core';
import {UsaaScrollResetDirective } from '@usaa/directives/scroll-reset/scroll-reset.directive';

@NgModule({
    declarations: [
       UsaaScrollResetDirective
    ],
    exports     : [
       UsaaScrollResetDirective
    ]
})
export class UsaaScrollResetModule
{
}
