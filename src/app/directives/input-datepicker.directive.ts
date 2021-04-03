import { Directive } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';

@Directive({
  selector: '[appInputDatepicker]'
})
export class InputDatepickerDirective {

openCalendar(picker: MatDatepicker<Date>){
  picker.open();
}

}
