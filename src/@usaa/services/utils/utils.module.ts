import { NgModule } from '@angular/core';
import { UsaaUtilsService } from '@usaa/services/utils/utils.service';

@NgModule({
    providers: [
       UsaaUtilsService
    ]
})
export class UsaaUtilsModule
{
    constructor(private usaaUtilsService: UsaaUtilsService)
    {
    }
}
