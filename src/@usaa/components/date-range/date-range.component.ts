import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostBinding, Input, OnDestroy, OnInit, Output, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Overlay } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatCalendarCellCssClasses, MatMonthView } from '@angular/material/datepicker';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
    selector     : 'usaa-date-range',
    templateUrl  : './date-range.component.html',
    styleUrls    : ['./date-range.component.scss'],
    encapsulation: ViewEncapsulation.None,
    exportAs     : 'usaaDateRange',
    providers    : [
        {
            provide    : NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() =>UsaaDateRangeComponent),
            multi      : true
        }
    ]
})
export class UsaaDateRangeComponent implements ControlValueAccessor, OnInit, OnDestroy
{
    @Output() readonly rangeChanged: EventEmitter<{ start: string; end: string }> = new EventEmitter<{ start: string; end: string }>();
    @ViewChild('matMonthView1') private matMonthView1!: MatMonthView<any>;
    @ViewChild('matMonthView2') private matMonthView2!: MatMonthView<any>;
    @ViewChild('pickerPanelOrigin', {read: ElementRef}) private pickerPanelOrigin!: ElementRef;
    @ViewChild('pickerPanel') private pickerPanel!: TemplateRef<any>;
    @HostBinding('class.usaa-date-range') private _defaultClassNames = true;

    activeDates: { month1: Moment | null; month2: Moment | null } = {
        month1: null,
        month2: null
    };
    setWhichDate: 'start' | 'end' = 'start';
    startTimeFormControl = new FormControl();
    endTimeFormControl = new FormControl();
    private _dateFormat = ""
    private onChange: (value: any) => void;
    private onTouched: (value: any) => void;
    private _programmaticChange!: boolean;
    private _range: { start: Moment | null; end: Moment | null } = {
        start: null,
        end  : null
    };
    private _timeFormat = ""
    private _timeRange = false;
    private readonly _timeRegExp: RegExp = new RegExp('^(0[0-9]|1[0-9]|2[0-4]|[0-9]):([0-5][0-9])(A|(?:AM)|P|(?:PM))?$', 'i');
    private unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef,
        private overlay: Overlay,
        private renderer2: Renderer2,
        private viewContainerRef: ViewContainerRef
    )
    {
        this.onChange = (): void => {
        };
        this.onTouched = (): void => {
        };
        this.dateFormat = 'DD/MM/YYYY';
        this.timeFormat = '12';

        this.init();
    }

    @Input()
    set dateFormat(value: string)
    {
        if ( this._dateFormat === value )
        {
            return;
        }

        this._dateFormat = value;
    }

    get dateFormat(): string
    {
        return this._dateFormat;
    }

    @Input()
    set timeFormat(value: string)
    {
        // Return if the values are the same
        if ( this._timeFormat === value )
        {
            return;
        }

        // Set format based on the time format input
        this._timeFormat = value === '12' ? 'hh:mmA' : 'HH:mm';
    }

    get timeFormat(): string
    {
        return this._timeFormat;
    }

    @Input()
    set timeRange(value: boolean)
    {
        if ( this._timeRange === value )
        {
            return;
        }

        this._timeRange = value;

        if ( !value )
        {
            this.range = {
                start: this._range.start?.clone().startOf('day'),
                end  : this._range.end?.clone().endOf('day')
            };
        }
    }

    get timeRange(): boolean
    {
        return this._timeRange;
    }

    @Input()
    set range(value)
    {
        if ( !value )
        {
            return;
        }

        if ( !value.start || !value.end )
        {
            console.error('Range input must have "start" and "end" properties!');

            return;
        }

        const whichDate = value.whichDate || null;

        const start = moment(value.start);
        const end = moment(value.end);

        if ( whichDate === 'start' )
        {
            this._range.start = start.clone();

            if ( this._range.start.isAfter(this._range.end) )
            {
                const endDate = start.clone().hours(this._range.end?.hours() || 0).minutes(this._range.end?.minutes() || 0).seconds(this._range.end?.seconds() || 0);

                if ( this._range.start.isBefore(endDate) )
                {
                    this._range.end = endDate;
                }
                else
                {
                    this._range.end = start.clone();
                }
            }
        }

        if ( whichDate === 'end' )
        {
            this._range.end = end.clone();

            if ( this._range.start?.isAfter(this._range.end) )
            {
                const startDate = end.clone().hours(this._range.start?.hours() || 0).minutes(this._range.start?.minutes() || 0).seconds(this._range.start?.seconds() || 0);

                if ( this._range.end.isAfter(startDate) )
                {
                    this._range.start = startDate;
                }
                else
                {
                    this._range.start = end.clone();
                }
            }
        }

        if ( !whichDate )
        {
            this._range.start = start.clone();

            // If the start date is before the end date, set the end date as normal.
            // If the start date is after the end date, set the end date same as the start date.
            this._range.end = start.isBefore(end) ? end.clone() : start.clone();
        }

        const range = {
            start: this._range.start?.clone().toISOString() || "",
            end  : this._range.end?.clone().toISOString() || ""
        };

        this.rangeChanged.emit(range);

        // Update the model with the range if the change was not a programmatic change
        // Because programmatic changes trigger writeValue which triggers onChange and onTouched
        // internally causing them to trigger twice which breaks the form's pristine and touched
        // statuses.
        if ( !this._programmaticChange )
        {
            this.onTouched(range);
            this.onChange(range);
        }

        this.activeDates = {
            month1: this._range.start?.clone() || null,
            month2: this._range.start?.clone().add(1, 'month') || null
        };

        this.startTimeFormControl.setValue(this._range.start?.clone().format(this._timeFormat).toString());
        this.endTimeFormControl.setValue(this._range.end?.clone().format(this._timeFormat).toString());

        // Run ngAfterContentInit on month views to trigger
        // re-render on month views if they are available
        if ( this.matMonthView1 && this.matMonthView2 )
        {
            this.matMonthView1.ngAfterContentInit();
            this.matMonthView2.ngAfterContentInit();
        }

        // Reset the programmatic change status
        this._programmaticChange = false;
    }

    get range(): any
    {
        // Clone the range start and end
        const start = this._range.start?.clone();
        const end = this._range.end?.clone();

        // Build and return the range object
        return {
            startDate: start?.clone().format(this.dateFormat),
            startTime: this.timeRange ? start?.clone().format(this.timeFormat) : null,
            endDate  : end?.clone().format(this.dateFormat),
            endTime  : this.timeRange ? end?.clone().format(this.timeFormat) : null
        };
    }

    registerOnChange(fn: any): void
    {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void
    {
        this.onTouched = fn;
    }

    writeValue(range: { start: string; end: string }): void
    {
        this._programmaticChange = true;

        this.range = range;
    }

    ngOnInit(): void
    {

    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();

        // @ TODO: Workaround until "angular/issues/20007" resolved
        this.writeValue = (): void => {
        };
    }

    openPickerPanel(): void
    {
        // Create the overlay
        const overlayRef = this.overlay.create({
            panelClass      : 'usaa-date-range-panel',
            backdropClass   : '',
            hasBackdrop     : true,
            scrollStrategy  : this.overlay.scrollStrategies.reposition(),
            positionStrategy: this.overlay.position()
                                  .flexibleConnectedTo(this.pickerPanelOrigin)
                                  .withPositions([
                                      {
                                          originX : 'start',
                                          originY : 'bottom',
                                          overlayX: 'start',
                                          overlayY: 'top',
                                          offsetY : 8
                                      },
                                      {
                                          originX : 'start',
                                          originY : 'top',
                                          overlayX: 'start',
                                          overlayY: 'bottom',
                                          offsetY : -8
                                      }
                                  ])
        });

        const templatePortal = new TemplatePortal(this.pickerPanel, this.viewContainerRef);

        overlayRef.backdropClick().subscribe(() => {

            if ( templatePortal && templatePortal.isAttached )
            {
                templatePortal.detach();
            }

            if ( overlayRef && overlayRef.hasAttached() )
            {
                overlayRef.detach();
                overlayRef.dispose();
            }
        });

        overlayRef.attach(templatePortal);
    }

    getMonthLabel(month: number): string
    {
        if ( month === 1 )
        {
            return this.activeDates.month1?.clone().format('MMMM Y') || "";
        }

        return this.activeDates.month2?.clone().format('MMMM Y') || "";
    }

    dateClass(): any
    {
        return (date: Moment): MatCalendarCellCssClasses | undefined => {

            if ( date.isSame(this._range.start, 'day') && date.isSame(this._range.end, 'day') )
            {
                return ['usaa-date-range', 'usaa-date-range-start', 'usaa-date-range-end'];
            }

            if ( date.isSame(this._range.start, 'day') )
            {
                return ['usaa-date-range', 'usaa-date-range-start'];
            }

            if ( date.isSame(this._range.end, 'day') )
            {
                return ['usaa-date-range', 'usaa-date-range-end'];
            }

            if ( date.isBetween(this._range.start, this._range.end, 'day') )
            {
                return ['usaa-date-range', 'usaa-date-range-mid'];
            }

            return undefined;
        };
    }

    dateFilter(): any
    {
        return (date: Moment): boolean => !(this.setWhichDate === 'end' && date.isBefore(this._range.start, 'day'));
    }

    onSelectedDateChange(date: Moment): void
    {
        const newRange = {
            start    : this._range.start?.clone().toISOString(),
            end      : this._range.end?.clone().toISOString(),
            whichDate: ""
        };

        if ( this.setWhichDate === 'start' )
        {
            newRange.start = moment(newRange.start).year(date.year()).month(date.month()).date(date.date()).toISOString();
        }
        else
        {
            newRange.end = moment(newRange.end).year(date.year()).month(date.month()).date(date.date()).toISOString();
        }

        newRange.whichDate = this.setWhichDate;

        this.setWhichDate = this.setWhichDate === 'start' ? 'end' : 'start';

        this.range = newRange;
    }

    prev(): void
    {
        this.activeDates.month1 = moment(this.activeDates.month1).subtract(1, 'month');
        this.activeDates.month2 = moment(this.activeDates.month2).subtract(1, 'month');
    }

    next(): void
    {
        this.activeDates.month1 = moment(this.activeDates.month1).add(1, 'month');
        this.activeDates.month2 = moment(this.activeDates.month2).add(1, 'month');
    }

    updateStartTime(event: any): void
    {
        const parsedTime = this.parseTime(event.target.value);

        if ( this.startTimeFormControl.invalid )
        {
            const time = this._range.start?.clone().format(this._timeFormat);

            this.startTimeFormControl.setValue(time);

            return;
        }

        const startDate = this._range.start?.clone().hours(parsedTime.hours()).minutes(parsedTime.minutes());

        // If the new start date is after the current end date,
        // use the end date's time and set the start date again
        if ( startDate?.isAfter(this._range.end) )
        {
            const endDateHours = this._range.end?.hours() || 0;
            const endDateMinutes = this._range.end?.minutes() || 0;

            // Set the start date
            startDate.hours(endDateHours).minutes(endDateMinutes);
        }

        this.range = {
            start    : startDate?.toISOString(),
            end      : this._range.end?.clone().toISOString(),
            whichDate: 'start'
        };
    }

    updateEndTime(event: any): void
    {
        if(event === null) {return;}

        const parsedTime = this.parseTime(event.target.value);

        // Go back to the previous value if the form control is not valid
        if ( this.endTimeFormControl.invalid )
        {
            const time = this._range.end?.clone().format(this._timeFormat);

            this.endTimeFormControl.setValue(time);

            return;
        }

        const endDate = this._range.end?.clone().hours(parsedTime.hours()).minutes(parsedTime.minutes());

        // If the new end date is before the current start date,
        // use the start date's time and set the end date again
        if ( endDate?.isBefore(this._range.start) )
        {
            const startDateHours = this._range.start?.hours() || 0;
            const startDateMinutes = this._range.start?.minutes() || 0;

            // Set the end date
            endDate.hours(startDateHours).minutes(startDateMinutes);
        }

        // If everything is okay, set the new date
        this.range = {
            start    : this._range.start?.clone().toISOString(),
            end      : endDate?.toISOString(),
            whichDate: 'end'
        };
    }

    private init(): void
    {
        this.startTimeFormControl = new FormControl('', [Validators.pattern(this._timeRegExp)]);
        this.endTimeFormControl = new FormControl('', [Validators.pattern(this._timeRegExp)]);

        this._programmaticChange = true;
        this.range = {
            start: moment().startOf('day').toISOString(),
            end  : moment().add(1, 'day').endOf('day').toISOString()
        };

        // Set the default time range
        this._programmaticChange = true;
        this.timeRange = true;
    }

    private parseTime(value: string): Moment
    {
        const timeArr = value.split(this._timeRegExp).filter(part => part !== '');

        const meridiem = timeArr[2] || null;

        if ( meridiem )
        {
            // Create a moment using 12-hours format and return it
            return moment(value, 'hh:mmA').seconds(0);
        }

        // If meridiem doesn't exist, create a moment using 24-hours format and return in
        return moment(value, 'HH:mm').seconds(0);
    }
}
