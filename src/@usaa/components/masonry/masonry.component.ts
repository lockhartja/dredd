import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, TemplateRef, ViewEncapsulation } from '@angular/core';
import { usaaAnimations } from '@usaa/animations';
import {UsaaMediaWatcherService } from '@usaa/services/media-watcher';

@Component({
    selector     : 'usaa-masonry',
    templateUrl  : './masonry.component.html',
    styleUrls    : ['./masonry.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : usaaAnimations,
    exportAs     : 'usaaMasonry'
})
export class UsaaMasonryComponent implements OnChanges, AfterViewInit
{
    @Input() columnsTemplate!: TemplateRef<any>;
    @Input() columns!: number;
    @Input() items: any[] = [];
    distributedColumns: any[] = [];

    constructor(private usaaMediaWatcherService:UsaaMediaWatcherService)
    {
    }

    ngOnChanges(changes: SimpleChanges): void
    {
        // Columns
        if ( 'columns' in changes )
        {
            // Distribute the items
            this.distributeItems();
        }

        // Items
        if ( 'items' in changes )
        {
            // Distribute the items
            this.distributeItems();
        }
    }

    ngAfterViewInit(): void
    {
        // Distribute the items for the first time
        this.distributeItems();
    }

    private distributeItems(): void
    {
        if ( this.items.length === 0 )
        {
            this.distributedColumns = [];
            return;
        }

        // Prepare the distributed columns array
        this.distributedColumns = Array.from(Array(this.columns), item => ({items: []}));

        // Distribute the items to columns
        for ( let i = 0; i < this.items.length; i++ )
        {
            this.distributedColumns[i % this.columns].items.push(this.items[i]);
        }
    }
}
