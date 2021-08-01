import { NgModule } from '@angular/core';
import { UsaaTailwindService } from '@usaa/services/tailwind/tailwind.service';

@NgModule({
    providers: [UsaaTailwindService],
})
export class UsaaTailwindConfigModule {
    constructor(private usaaTailwindConfigService: UsaaTailwindService) {}
}
