import { Directive, Input, Output, SimpleChange, ElementRef, HostListener, EventEmitter} from '@angular/core';
import { NgModel } from "@angular/forms";
import { PowerConversionPipe } from '../pipes/power-conversion.pipe'

@Directive({
  selector: '[appPowerConversion]',
  providers: [NgModel],
})

export class PowerConversionDirective {

  @Input('appPowerConversion') val
  @Output() valueChanged = new EventEmitter();

  constructor(
    private el: ElementRef,
    private PowerConversionPipe: PowerConversionPipe) {
  }

  powerConvert(event?: any,val?:any) {
    var ele = event;
    let powerData = this.PowerConversionPipe.transform(ele.value);
  }

  @HostListener('keyup') onkeyup() {
    let powerData = {
      flag: true,
      value: this.el.nativeElement.value,
    }
    this.powerConvert(powerData);
  }

}

