import { Component, OnInit, Input, AfterViewInit, ElementRef, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';

import * as moment from 'moment';
declare var $: any;
@Component({
  selector: 'app-month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.scss']
})
export class MonthPickerComponent implements OnInit, OnChanges {

  @Input() date: any;
  @Input() dateType: any;
  @Input() changeMonth: any;
  @Input() placeHolder: any;
  @Output() onChange = new EventEmitter<object>();
  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if(this.date){
      if(this.changeMonth && this.changeMonth!=''){
        //$(this.elementRef.nativeElement).find('.date-range').MonthPicker('option', this.dateType, new Date(this.changeMonth).getMonth());
      }
    }
  }

  ngAfterViewInit() {
    this.bindDateRangePicker();
  }

  bindDateRangePicker() {
    $(this.elementRef.nativeElement).find('.date-range').MonthPicker({
    	ShowIcon: false,
      MonthFormat: 'M, y',
    	OnAfterChooseMonth: (date) => {
        this.onChange.emit({
          date: date
        });
      }
    });
  }

}
