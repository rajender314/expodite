import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'powerConversion'
})
export class PowerConversionPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // console.log(value)
    if(value) {
      var matches = value.match(/\([0-9a-zA-Z\d]+\^+([\-]?)+[0-9a-zA-Z\d]+\)/ig);
    }
    if (matches && matches.length) {
      matches.map(function (m) {
        value = value.replace(m, (function () {
          var powers = m.replace('(', '').replace(')', '').split('^');
          return powers.length == 2 ? '<span class="kpc">'+ powers[0] + '<sup>' + powers[1] + '</sup></span>' + '&nbsp': '';
        })());
      });      
      let data = value.trim();
      return data
    }
      return value
  }
}

