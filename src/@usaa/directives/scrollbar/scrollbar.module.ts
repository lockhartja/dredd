import { NgModule } from '@angular/core';
import {UsaaScrollbarDirective } from '@usaa/directives/scrollbar/scrollbar.directive';

@NgModule({
    declarations: [
       UsaaScrollbarDirective
    ],
    exports     : [
       UsaaScrollbarDirective
    ]
})
export class UsaaScrollbarModule
{
}
