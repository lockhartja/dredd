import { NgModule } from '@angular/core';
import { UsaaFindByKeyPipe } from '@usaa/pipes/find-by-key/find-by-key.pipe';

@NgModule({
    declarations: [UsaaFindByKeyPipe],
    exports: [UsaaFindByKeyPipe],
})
export class UsaaFindByKeyPipeModule {}
