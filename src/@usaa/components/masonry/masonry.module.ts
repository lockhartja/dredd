import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsaaMasonryComponent } from '@usaa/components/masonry/masonry.component';

@NgModule({
    declarations: [
       UsaaMasonryComponent
    ],
    imports     : [
        CommonModule
    ],
    exports     : [
       UsaaMasonryComponent
    ]
})
export class UsaaMasonryModule
{
}
