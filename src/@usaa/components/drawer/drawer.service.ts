import { Injectable } from '@angular/core';
import { UsaaDrawerComponent } from '@usaa/components/drawer/drawer.component';

@Injectable({
    providedIn: 'root'
})
export class UsaaDrawerService
{
    private componentRegistry: Map<string,UsaaDrawerComponent> = new Map<string,UsaaDrawerComponent>();

    constructor()
    {
    }

    registerComponent(name: string, component:UsaaDrawerComponent): void
    {
        this.componentRegistry.set(name, component);
    }


    deregisterComponent(name: string): void
    {
        this.componentRegistry.delete(name);
    }


    getComponent(name: string):UsaaDrawerComponent | undefined
    {
        return this.componentRegistry.get(name);
    }
}
