import { Pipe, PipeTransform } from '@angular/core';
const padding = "000000";


@Pipe({
  name: 'epiCurrency'
})
export class EpiCurrencyPipe implements PipeTransform {

  private prefix: string;
  private decimal_separator: string;
  private thousands_separator: string;
  private suffix: string;
  constructor() {
    this.prefix = '';
    this.suffix = '';
    this.decimal_separator = '.';
    this.thousands_separator = ',';
  }
  //{{ user.name | uselessPipe:"Mr.":"the great" }}
  transform(value: string,currency:any='USD',showCurrency:any=false, fractionSize: number = 2): string {
    value = parseFloat(value).toFixed(2);
   
    if (parseFloat(value) % 1 != 0) {
      fractionSize = 2;
    }
    let [integer, fraction = ""] = (parseFloat(value).toString() || "").toString().split(".");

    fraction = fractionSize > 0
      ? this.decimal_separator + (fraction + padding).substring(0, fractionSize) : "";

    if (currency == 'USD') {
      integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.thousands_separator);
    } else if(currency == 'INR') {
      integer = parseInt(integer).toLocaleString('en-IN');
    } else{
      integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.thousands_separator);
    }

    if (isNaN(parseFloat(integer))) {
      integer = "0";
    }
    
    this.prefix = showCurrency ? currency+' ' : '';
    return this.prefix + integer + fraction + this.suffix;

  }

}

@Pipe({
  name: 'myfilter',
  pure: false
})
export class MyFilterPipe implements PipeTransform {
  transform(items: any[], filter: string): any {
    if (!items || !filter) {
      
      return items;
    }
    return items.filter(item => item.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
  }
}
