import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsaaDrawerComponent } from '@usaa/components/drawer/drawer.component';

@NgModule({
    declarations: [
       UsaaDrawerComponent
    ],
    imports     : [
        CommonModule
    ],
    exports     : [
       UsaaDrawerComponent
    ]
})
export class UsaaDrawerModule
{
}
