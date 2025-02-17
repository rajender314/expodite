import { Directive, HostListener, ElementRef, Input, Renderer2, OnInit } from '@angular/core';
import { EpiCurrencyPipe } from '../pipes/epi-currency.pipe';
@Directive({
  selector: "[appEpiCurrency]"
})

export class EpiCurrencyDirective {
  private el: any;
  @Input("data") data: any;
  @Input("symbol") symbol: any;
  @Input("min") min: any = 0;
  @Input("max") max: any = 999999999;
  constructor(
    private elementRef: ElementRef,
    private formatcurrencypipe: EpiCurrencyPipe,
    private renderer: Renderer2
  ) {
    this.el = this.elementRef.nativeElement;
    this.el.value = this.formatcurrencypipe.transform(this.el.value);
  }
  ngOnInit() {
    this.el.value = this.formatcurrencypipe.transform(this.el.value);
  }
  getNum(value) {
    let num = value.split(",");
    num[0] = num[0].replace(this.symbol, "");
    num = num.join("");
    return num;
  }
  @HostListener("focus", ["$event.target.value", "$event"])
  onFocus(value, event) {
    this.el.value = this.getNum(value);
    if (event.which == 9) {
      return false;
    }
    this.el.select();
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {
    // if (this.min > this.el.value) {
    //   value = 0;
    //   // e.preventDefault();
    // } else if (this.max < this.el.value) {
    //   value = this.max;
    // }
    this.el.value = this.formatcurrencypipe.transform(value);
  }
  @HostListener("keydown", ["$event"]) onKeyDown(event) {
    let e = <KeyboardEvent>event;
    if (
      [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
    }
  }
}
