import { Injectable } from '@angular/core';
import {UsaaNavigationItem } from '@usaa/components/navigation/navigation.types';

@Injectable({
    providedIn: 'root'
})
export class UsaaNavigationService
{
    private componentRegistry: Map<string, any> = new Map<string, any>();
    private _navigationStore: Map<string,UsaaNavigationItem[]> = new Map<string, any>();

    constructor()
    {
    }

    registerComponent(name: string, component: any): void
    {
        this.componentRegistry.set(name, component);
    }

    deregisterComponent(name: string): void
    {
        this.componentRegistry.delete(name);
    }

    getComponent<T>(name: string): T
    {
        return this.componentRegistry.get(name);
    }

    storeNavigation(key: string, navigation:UsaaNavigationItem[]): void
    {
        // Add to the store
        this._navigationStore.set(key, navigation);
    }

    getNavigation(key: string):UsaaNavigationItem[]
    {
        return this._navigationStore.get(key) ?? [];
    }


    deleteNavigation(key: string): void
    {
        // Check if the navigation exists
        if ( !this._navigationStore.has(key) )
        {
            console.warn(`Navigation with the key '${key}' does not exist in the store.`);
        }

        // Delete from the storage
        this._navigationStore.delete(key);
    }

 
    getFlatNavigation(navigation:UsaaNavigationItem[], flatNavigation:UsaaNavigationItem[] = []):UsaaNavigationItem[]
    {
        for ( const item of navigation )
        {
            if ( item.type === 'basic' )
            {
                flatNavigation.push(item);
                continue;
            }

            if ( item.type === 'aside' || item.type === 'collapsable' || item.type === 'group' )
            {
                if ( item.children )
                {
                    this.getFlatNavigation(item.children, flatNavigation);
                }
            }
        }

        return flatNavigation;
    }

    getItem(id: string, navigation:UsaaNavigationItem[]):UsaaNavigationItem | null
    {
        for ( const item of navigation )
        {
            if ( item.id === id )
            {
                return item;
            }

            if ( item.children )
            {
                const childItem = this.getItem(id, item.children);

                if ( childItem )
                {
                    return childItem;
                }
            }
        }

        return null;
    }

    getItemParent(
        id: string,
        navigation:UsaaNavigationItem[],
        parent:UsaaNavigationItem[] |UsaaNavigationItem
    ):UsaaNavigationItem[] |UsaaNavigationItem | null
    {
        for ( const item of navigation )
        {
            if ( item.id === id )
            {
                return parent;
            }

            if ( item.children )
            {
                const childItem = this.getItemParent(id, item.children, item);

                if ( childItem )
                {
                    return childItem;
                }
            }
        }

        return null;
    }
}
